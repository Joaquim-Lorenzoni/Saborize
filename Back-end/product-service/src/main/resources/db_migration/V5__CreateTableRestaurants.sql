
CREATE TABLE tb_restaurant (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE
);


CREATE TABLE tb_plan_restaurant (
    plan_id BIGINT NOT NULL,
    restaurant_id BIGINT NOT NULL,
    PRIMARY KEY (plan_id, restaurant_id),
    FOREIGN KEY (plan_id) REFERENCES tb_product(id),
    FOREIGN KEY (restaurant_id) REFERENCES tb_restaurant(id)
);