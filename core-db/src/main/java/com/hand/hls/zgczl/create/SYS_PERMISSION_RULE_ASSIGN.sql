CREATE TABLE "SYS_PERMISSION_RULE_ASSIGN" (
  "ASSIGN_ID" NUMBER(38) NOT NULL ,
  "DETAIL_ID" NUMBER(38) NOT NULL ,
  "ASSIGN_FIELD" VARCHAR2(250 BYTE) NOT NULL ,
  "ASSIGN_FIELD_VALUE" VARCHAR2(250 BYTE) NOT NULL ,
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
  BUFFER_POOL DEFAULT
)
PARALLEL 1
NOCACHE
DISABLE ROW MOVEMENT
;
COMMENT ON COLUMN "SYS_PERMISSION_RULE_ASSIGN"."ASSIGN_ID" IS 'PK';
COMMENT ON COLUMN "SYS_PERMISSION_RULE_ASSIGN"."DETAIL_ID" IS 'MANGE CODE';
COMMENT ON COLUMN "SYS_PERMISSION_RULE_ASSIGN"."ASSIGN_FIELD" IS '层级';
COMMENT ON COLUMN "SYS_PERMISSION_RULE_ASSIGN"."ASSIGN_FIELD_VALUE" IS '层级值';
COMMENT ON TABLE "SYS_PERMISSION_RULE_ASSIGN" IS '规则屏蔽管理表';

-- ----------------------------
-- Primary Key structure for table SYS_PERMISSION_RULE_ASSIGN
-- ----------------------------
ALTER TABLE "SYS_PERMISSION_RULE_ASSIGN" ADD CONSTRAINT "SYS_C00143836" PRIMARY KEY ("ASSIGN_ID");

-- ----------------------------
-- Uniques structure for table SYS_PERMISSION_RULE_ASSIGN
-- ----------------------------
ALTER TABLE "SYS_PERMISSION_RULE_ASSIGN" ADD CONSTRAINT "SYS_C00143837" UNIQUE ("DETAIL_ID", "ASSIGN_FIELD", "ASSIGN_FIELD_VALUE") NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;