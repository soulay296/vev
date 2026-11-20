ALTER TABLE trips DROP CONSTRAINT IF EXISTS trips_vehicle_type_check;

UPDATE trips SET vehicle_type = CASE vehicle_type
  WHEN 'bus' THEN 'louage12'
  WHEN 'minibus' THEN 'louage8'
  WHEN 'van' THEN 'louage6'
  ELSE vehicle_type
END;

ALTER TABLE trips ADD CONSTRAINT trips_vehicle_type_check
  CHECK (vehicle_type IN ('louage6', 'louage8', 'louage12'));
