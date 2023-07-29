-- This table represents our students.
-- Total score represents all the points a student has ever gotten.
CREATE TABLE IF NOT EXISTS PLR_students (
    user_id BIGINT PRIMARY KEY,
    display_name VARCHAR(256) NOT NULL,
    color VARCHAR(256),
    total_score INT DEFAULT 0
);

-- This insert will grab every student in the DB when the table is made.
INSERT INTO PLR_students (user_id, display_name)
SELECT 
    user_id, name
FROM
    users
WHERE
    user_id NOT IN (
        SELECT
            user_id
        FROM
            job_sequences
    );

-- This trigger inserts into our PLR_students table all the necessary information
-- if a new student is entered into the users DB.
CREATE OR REPLACE FUNCTION insert_student_from_users()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO PLR_students (user_id, display_name)
    VALUES (NEW.user_id, NEW.name);

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

--This trigger is what listens for inserts on the users table and calls our other trigger
CREATE TRIGGER trigger_insert_student
AFTER INSERT ON users
FOR EACH ROW
EXECUTE FUNCTION insert_student_from_users();