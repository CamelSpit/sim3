INSERT INTO sim3users (firstname, lastname, username, email, auth_id)
VALUES ($1, $2, $3, $4, $5)
RETURNING *;