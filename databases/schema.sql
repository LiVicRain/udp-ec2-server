CREATE DATABASE flutter_udp;
USE flutter_udp;

CREATe TABLE notes (
    id integer PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    contents TEXT NOT NULL,
    created TIMESTAMP NOT NULL DEFAULT NOW()
);

INSERT INTO notes(title, contents)
VALUES
("My First Note", "A note about something"),
("My Second Note", "A note about someting else");

SELECT * FROM notes;

DROP TABLE  notes;


CREATE TABLE users (
    id CHAR(36) PRIMARY KEY,
    name VARCHAR(12) NOT NULL,
    email VARCHAR(40) NOT NULL,
    profile_image VARCHAR(255) NOT NULL,
    pick_point INT NOT NULL,
    gender VARCHAR(6),
    birth_date VARCHAR(10),
    phone_number VARCHAR(20),
    type VARCHAR(20) NOT NULL,
    login_platform VARCHAR(20) NOT NULL,
    unique_identifier VARCHAR(255) NOT NULL,
    jwt_refresh_token TEXT,
    create_at DATETIME NOT NULL,
    update_at DATETIME NOT NULL
);

-- 픽뷰 구매 --
CREATE TABLE rentals (
    id CHAR(36) PRIMARY KEY,
    user_id CHAR(36) NOT NULL,
    product_key VARCHAR(255) NOT NULL,
    price INT NOT NULL,
    rental_date DATETIME NOT NULL,
    rental_end_date DATETIME NOT NULL,
    CONSTRAINT fk_user_id FOREIGN KEY (user_id) REFERENCES users(id)
);
