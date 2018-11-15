CREATE TABLE  "SYS_OAUTH_CLIENT_DETAILS" (
  "ID" NUMBER(38) NOT NULL ,
  "CLIENT_ID" VARCHAR2(100 BYTE) NOT NULL ,
  "CLIENT_SECRET" VARCHAR2(256 BYTE) ,
  "AUTHORIZED_GRANT_TYPES" VARCHAR2(256 BYTE) NOT NULL ,
  "RESOURCE_IDS" VARCHAR2(256 BYTE) DEFAULT 'api-resource' ,
  "AUTHORITIES" VARCHAR2(256 BYTE) ,
  "AUTO_APPROVE" VARCHAR2(256 BYTE) ,
  "SCOPE" VARCHAR2(256 BYTE) ,
  "ACCESS_TOKEN_VALIDITY" NUMBER(38) ,
  "REFRESH_TOKEN_VALIDITY" NUMBER(38) ,
  "WEB_SERVER_REDIRECT_URI" VARCHAR2(2000 BYTE) ,
  "ADDITIONAL_INFORMATION" VARCHAR2(4000 BYTE) ,
  "OBJECT_VERSION_NUMBER" NUMBER(38) DEFAULT 1 ,
  "REQUEST_ID" NUMBER(38) DEFAULT -1 ,
  "PROGRAM_ID" NUMBER(38) DEFAULT -1 ,
  "CREATED_BY" NUMBER(38) DEFAULT -1 ,
  "CREATION_DATE" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP ,
  "LAST_UPDATED_BY" NUMBER(38) DEFAULT -1 ,
  "LAST_UPDATE_DATE" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP ,
  "LAST_UPDATE_LOGIN" NUMBER(38) DEFAULT -1 
)
LOGGING
NOCOMPRESS
PCTFREE 10
INITRANS 1
STORAGE (
  INITIAL 65536 
  NEXT 1048576 
  MINEXTENTS 1
  MAXEXTENTS 2147483645
  BUFFER_POOL DEFAULT
)
PARALLEL 1
NOCACHE
DISABLE ROW MOVEMENT
;
COMMENT ON COLUMN  "SYS_OAUTH_CLIENT_DETAILS"."ID" IS '表ID，主键，供其他表做外键';
COMMENT ON COLUMN  "SYS_OAUTH_CLIENT_DETAILS"."CLIENT_ID" IS '客户端id';
COMMENT ON COLUMN  "SYS_OAUTH_CLIENT_DETAILS"."CLIENT_SECRET" IS '客户端密码';
COMMENT ON COLUMN  "SYS_OAUTH_CLIENT_DETAILS"."AUTHORIZED_GRANT_TYPES" IS '授权模式';
COMMENT ON COLUMN  "SYS_OAUTH_CLIENT_DETAILS"."RESOURCE_IDS" IS '资源ID';
COMMENT ON COLUMN  "SYS_OAUTH_CLIENT_DETAILS"."AUTHORITIES" IS '角色信息';
COMMENT ON COLUMN  "SYS_OAUTH_CLIENT_DETAILS"."AUTO_APPROVE" IS '自动授权';
COMMENT ON COLUMN  "SYS_OAUTH_CLIENT_DETAILS"."SCOPE" IS 'scope';
COMMENT ON COLUMN  "SYS_OAUTH_CLIENT_DETAILS"."ACCESS_TOKEN_VALIDITY" IS 'accessToken 失效时间';
COMMENT ON COLUMN  "SYS_OAUTH_CLIENT_DETAILS"."REFRESH_TOKEN_VALIDITY" IS 'refreshToken 失效时间';
COMMENT ON COLUMN  "SYS_OAUTH_CLIENT_DETAILS"."WEB_SERVER_REDIRECT_URI" IS '授权码模式下的重定向URI';
COMMENT ON COLUMN  "SYS_OAUTH_CLIENT_DETAILS"."ADDITIONAL_INFORMATION" IS '自定义信息';

-- ----------------------------
-- Primary Key structure for table SYS_OAUTH_CLIENT_DETAILS
-- ----------------------------
ALTER TABLE  "SYS_OAUTH_CLIENT_DETAILS" ADD CONSTRAINT "SYS_OAUTH_CLIENT_DETAILS_PK" PRIMARY KEY ("ID");

-- ----------------------------
-- Uniques structure for table SYS_OAUTH_CLIENT_DETAILS
-- ----------------------------
ALTER TABLE  "SYS_OAUTH_CLIENT_DETAILS" ADD CONSTRAINT "SYS_OAUTH_CLIENT_U1" UNIQUE ("CLIENT_ID") NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;

-- ----------------------------
-- SEQUENCE
-- ----------------------------
CREATE SEQUENCE  "SYS_OAUTH_CLIENT_DETAILS_S"  MINVALUE 1 MAXVALUE 9999999999999999999999999999 INCREMENT BY 1 START WITH 10041 CACHE 20 NOORDER  NOCYCLE