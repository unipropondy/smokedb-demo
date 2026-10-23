const express = require("express");
const router = express.Router();
const sql = require("mssql");
const crypto = require("crypto");
const { poolPromise } = require("../config/db");

// Helper: returns true only if val is a valid non-empty UUID string
const isValidUUID = (val) =>
  val &&
  typeof val === "string" &&
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
    val.trim()
  );

// ─── GET /api/kiosk-customers/search?carNumber=XXX ──────────────────────────
// Search for a customer by car plate number (case-insensitive)
router.get("/search", async (req, res) => {
  try {
    const { carNumber } = req.query;
    if (!carNumber) {
      return res.status(400).json({ error: "carNumber is required" });
    }

    const pool = await poolPromise;
    const request = pool
      .request()
      .input("CarNumber", sql.NVarChar, String(carNumber).trim().toUpperCase());

    const query = `SELECT TOP 1
           CustomerVehicleId, CustomerName, CarNumber, MobileNumber,
           VehicleType, DefaultDishId, StoreId, IsActive,
           CreatedBy, CreatedOn, UpdatedBy, UpdatedOn
         FROM kioskCustomer
         WHERE UPPER(CarNumber) = @CarNumber AND IsActive = 1
         ORDER BY UpdatedOn DESC`;

    const result = await request.query(query);

    if (result.recordset.length === 0) {
      return res
        .status(404)
        .json({ found: false, message: "No customer found for this car number" });
    }

    return res.json({ found: true, customer: result.recordset[0] });
  } catch (err) {
    console.error("[KIOSK CUSTOMERS SEARCH ERROR]", err);
    res.status(500).json({ error: err.message });
  }
});

// ─── GET /api/kiosk-customers ─────────────────────────────────────────────────
// List all active kiosk customers
router.get("/", async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query(`
      SELECT CustomerVehicleId, CustomerName, CarNumber, MobileNumber, VehicleType,
             DefaultDishId, StoreId, IsActive, CreatedBy, CreatedOn, UpdatedBy, UpdatedOn
      FROM kioskCustomer WHERE IsActive = 1 ORDER BY CustomerName
    `);
    res.json(result.recordset);
  } catch (err) {
    console.error("[KIOSK CUSTOMERS GET ERROR]", err);
    res.status(500).json({ error: err.message });
  }
});

// ─── POST /api/kiosk-customers ────────────────────────────────────────────────
// Create a new kiosk customer record
//
// IMPORTANT — Actual DB schema for kioskCustomer:
//   CustomerVehicleId  uniqueidentifier  NOT NULL
//   CustomerName       nvarchar(150)     NOT NULL
//   CarNumber          nvarchar(50)      NOT NULL
//   MobileNumber       nvarchar(30)      NULL
//   VehicleType        nvarchar(100)     NULL
//   DefaultDishId      uniqueidentifier  NULL
//   StoreId            uniqueidentifier  NULL   ← NOT int!
//   IsActive           bit               NOT NULL
//   CreatedBy          uniqueidentifier  NULL   ← NOT nvarchar!
//   CreatedOn          datetime          NOT NULL
//   UpdatedBy          uniqueidentifier  NULL   ← NOT nvarchar!
//   UpdatedOn          datetime          NULL
//
// mssql throws "Operand type clash: int is incompatible with uniqueidentifier"
// when a null/non-UUID value is bound to a UniqueIdentifier param.
// Fix: only include optional UniqueIdentifier params when a valid UUID is supplied.
router.post("/", async (req, res) => {
  try {
    const {
      customerName,
      carNumber,
      mobileNumber,
      vehicleType,
      defaultDishId,
      storeId,
      createdBy,
    } = req.body;

    if (!carNumber) {
      return res.status(400).json({ error: "carNumber is required" });
    }

    const pool = await poolPromise;
    const now = new Date();
    const newId = crypto.randomUUID();

    // Base params — only non-UniqueIdentifier nullable columns here
    const request = pool
      .request()
      .input("CustomerVehicleId", sql.UniqueIdentifier, newId)
      // CustomerName is NOT NULL in DB — use empty string as fallback
      .input("CustomerName", sql.NVarChar, customerName ? String(customerName).trim() : "")
      .input("CarNumber", sql.NVarChar, String(carNumber).trim().toUpperCase())
      .input("MobileNumber", sql.NVarChar, mobileNumber ? String(mobileNumber).trim() : null)
      .input("VehicleType", sql.NVarChar, vehicleType ? String(vehicleType).trim() : null)
      .input("IsActive", sql.Bit, 1)
      .input("CreatedOn", sql.DateTime, now)
      .input("UpdatedOn", sql.DateTime, now);

    // Only bind UniqueIdentifier params when the caller provides a valid UUID
    const hasDefaultDish = isValidUUID(defaultDishId);
    const hasStoreId     = isValidUUID(storeId);
    const hasCreatedBy   = isValidUUID(createdBy);

    if (hasDefaultDish) request.input("DefaultDishId", sql.UniqueIdentifier, defaultDishId.trim());
    if (hasStoreId)     request.input("StoreId",       sql.UniqueIdentifier, storeId.trim());
    if (hasCreatedBy) {
      request.input("CreatedBy", sql.UniqueIdentifier, createdBy.trim());
      request.input("UpdatedBy", sql.UniqueIdentifier, createdBy.trim());
    }

    // Build INSERT dynamically — only include columns we have values for
    const optionalCols = [
      hasDefaultDish ? "DefaultDishId" : null,
      hasStoreId     ? "StoreId"       : null,
      hasCreatedBy   ? "CreatedBy"     : null,
      hasCreatedBy   ? "UpdatedBy"     : null,
    ].filter(Boolean);

    const baseCols = "CustomerVehicleId, CustomerName, CarNumber, MobileNumber, VehicleType, IsActive, CreatedOn, UpdatedOn";
    const baseVals = "@CustomerVehicleId, @CustomerName, @CarNumber, @MobileNumber, @VehicleType, @IsActive, @CreatedOn, @UpdatedOn";

    const allCols = optionalCols.length
      ? `${baseCols}, ${optionalCols.join(", ")}`
      : baseCols;
    const allVals = optionalCols.length
      ? `${baseVals}, ${optionalCols.map((c) => `@${c}`).join(", ")}`
      : baseVals;

    await request.query(
      `INSERT INTO kioskCustomer (${allCols}) VALUES (${allVals})`
    );

    res.status(201).json({
      success: true,
      customerVehicleId: newId,
      carNumber: String(carNumber).trim().toUpperCase(),
      customerName: customerName || null,
    });
  } catch (err) {
    console.error("[KIOSK CUSTOMERS CREATE ERROR]", err);
    res.status(500).json({ error: err.message });
  }
});

// ─── PUT /api/kiosk-customers/:id ────────────────────────────────────────────
// Update an existing kiosk customer record (CustomerName only for now)
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { customerName, mobileNumber, vehicleType, updatedBy } = req.body;

    const pool = await poolPromise;
    const now = new Date();

    const request = pool
      .request()
      .input("CustomerVehicleId", sql.UniqueIdentifier, id)
      .input("CustomerName", sql.NVarChar, customerName ? String(customerName).trim() : "")
      .input("MobileNumber", sql.NVarChar, mobileNumber ? String(mobileNumber).trim() : null)
      .input("VehicleType", sql.NVarChar, vehicleType ? String(vehicleType).trim() : null)
      .input("UpdatedOn", sql.DateTime, now);

    // UpdatedBy is a uniqueidentifier column — only bind if a valid UUID is provided
    if (isValidUUID(updatedBy)) {
      request.input("UpdatedBy", sql.UniqueIdentifier, updatedBy.trim());
    }

    const setUpdatedBy = isValidUUID(updatedBy) ? ", UpdatedBy = @UpdatedBy" : "";

    await request.query(`
      UPDATE kioskCustomer
      SET CustomerName = @CustomerName,
          MobileNumber = @MobileNumber,
          VehicleType  = @VehicleType,
          UpdatedOn    = @UpdatedOn
          ${setUpdatedBy}
      WHERE CustomerVehicleId = @CustomerVehicleId
    `);

    res.json({ success: true });
  } catch (err) {
    console.error("[KIOSK CUSTOMERS UPDATE ERROR]", err);
    res.status(500).json({ error: err.message });
  }
});

// ─── DELETE /api/kiosk-customers/:id ─────────────────────────────────────────
// Soft-delete: set IsActive = 0
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const pool = await poolPromise;
    await pool
      .request()
      .input("CustomerVehicleId", sql.UniqueIdentifier, id)
      .input("UpdatedOn", sql.DateTime, new Date())
      .query(`
        UPDATE kioskCustomer
        SET IsActive = 0, UpdatedOn = @UpdatedOn
        WHERE CustomerVehicleId = @CustomerVehicleId
      `);
    res.json({ success: true });
  } catch (err) {
    console.error("[KIOSK CUSTOMERS DELETE ERROR]", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
