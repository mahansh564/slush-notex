CREATE DATABASE slush;

CREATE SEQUENCE user_id_sequence
  MINVALUE 10001
  MAXVALUE 99999999
  START WITH 10001
  INCREMENT BY 1
  CACHE 20;

CREATE SEQUENCE note_id_sequence
  MINVALUE 10001
  MAXVALUE 99999999
  START WITH 10001
  INCREMENT BY 1
  CACHE 20;

CREATE TABLE users
(
    id integer NOT NULL,
	  username varchar(100),
	  user_password varchar(255),
    name varchar(100),
    primary key (id)
	
);

CREATE TABLE notes 
(
	note_id integer NOT NULL,
	created_by integer NOT NULL,
	heading varchar(250) NOT NULL,
	body text NOT NULL,
	created_at date NOT NULL,
	primary key (note_id),
	FOREIGN KEY (created_by) REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE
);

INSERT INTO users VALUES (NEXTVAL('user_id_sequence'), 'admin', 'adminadmin', 'admin');
INSERT INTO notes VALUES (NEXTVAL('note_id_sequence'), 10001, 'test heading', 'test body', CURRENT_DATE);


-------------

CREATE or REPLACE PROCEDURE insert_into_users(un in varchar, up in varchar, na in varchar)
LANGUAGE SQL AS
$$
INSERT INTO users(id, username, user_password, name) values(NEXTVAL('user_id_sequence'), un, up, na);
$$;

-------------

CREATE or REPLACE PROCEDURE insert_into_notes(ui in integer, he in varchar, bo in text)
LANGUAGE SQL AS
$$
INSERT INTO notes(note_id, created_by, heading, body, created_at) values(NEXTVAL('note_id_sequence'), ui, he, bo, CURRENT_TIMESTAMP);
$$;