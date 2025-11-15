create table tb_product (
    id serial not null,
    name VARCHAR(255),
    description varchar(100) not null,
    currency varchar(3) not null,
    price float(53) not null,
    stock integer not null,
    primary key (id)
);