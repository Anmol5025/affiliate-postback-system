CREATE TABLE affiliates (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);

CREATE TABLE campaigns (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);

CREATE TABLE clicks (
    id SERIAL PRIMARY KEY,
    affiliate_id INTEGER REFERENCES affiliates(id),
    campaign_id INTEGER REFERENCES campaigns(id),
    click_id VARCHAR(255) NOT NULL,
    timestamp TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(affiliate_id, campaign_id, click_id)
);

CREATE TABLE conversions (
    id SERIAL PRIMARY KEY,
    click_id INTEGER REFERENCES clicks(id),
    amount NUMERIC(10, 2) NOT NULL,
    currency VARCHAR(10) NOT NULL,
    timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- Dummy Data

INSERT INTO affiliates (name) VALUES ('Affiliate 1'), ('Affiliate 2');
INSERT INTO campaigns (name) VALUES ('Campaign A'), ('Campaign B');