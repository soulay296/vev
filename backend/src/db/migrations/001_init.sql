CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT NOT NULL DEFAULT '',
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'student' CHECK (role IN ('student', 'owner')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS trips (
  id SERIAL PRIMARY KEY,
  owner_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  from_city TEXT NOT NULL,
  to_city TEXT NOT NULL,
  departure_date DATE NOT NULL,
  departure_time TEXT NOT NULL,
  price INTEGER NOT NULL CHECK (price > 0),
  total_seats INTEGER NOT NULL CHECK (total_seats BETWEEN 1 AND 60),
  vehicle_type TEXT NOT NULL CHECK (vehicle_type IN ('bus', 'minibus', 'van')),
  phone TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS trips_route_idx ON trips (from_city, to_city, departure_date);
CREATE INDEX IF NOT EXISTS trips_owner_idx ON trips (owner_id);

CREATE TABLE IF NOT EXISTS bookings (
  id SERIAL PRIMARY KEY,
  trip_id INTEGER NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  seats INTEGER NOT NULL CHECK (seats > 0),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'refused', 'cancelled')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS bookings_trip_idx ON bookings (trip_id);
CREATE INDEX IF NOT EXISTS bookings_user_idx ON bookings (user_id);
CREATE UNIQUE INDEX IF NOT EXISTS bookings_unique_active ON bookings (user_id, trip_id) WHERE status IN ('pending', 'confirmed');
