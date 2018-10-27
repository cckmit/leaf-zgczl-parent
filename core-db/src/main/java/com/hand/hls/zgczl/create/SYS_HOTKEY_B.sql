CREATE TABLE "SYS_HOTKEY_B" (
  "HOTKEY_ID" NUMBER(38) NOT NULL ,
  "CODE" VARCHAR2(50 BYTE) NOT NULL ,
  "HOTKEY_LEVEL" VARCHAR2(50 BYTE) DEFAULT 'system'  NOT NULL ,
  "HOTKEY_LEVEL_ID" NUMBER(38) DEFAULT 0  NOT NULL ,
  "HOTKEY" VARCHAR2(50 BYTE) ,
  "DESCRIPTION" VARCHAR2(250 BYTE) ,
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
COMMENT ON COLUMN "SYS_HOTKEY_B"."HOTKEY_ID" IS 'PK';
COMMENT ON COLUMN "SYS_HOTKEY_B"."CODE" IS '热键编码';
COMMENT ON COLUMN "SYS_HOTKEY_B"."HOTKEY_LEVEL" IS '热键级别';
COMMENT ON COLUMN "SYS_HOTKEY_B"."HOTKEY_LEVEL_ID" IS '热键级别ID';
COMMENT ON COLUMN "SYS_HOTKEY_B"."HOTKEY" IS '热键';
COMMENT ON COLUMN "SYS_HOTKEY_B"."DESCRIPTION" IS '热键描述';
COMMENT ON TABLE "SYS_HOTKEY_B" IS '系统热键';

-- ----------------------------
-- Records of SYS_HOTKEY_B
-- ----------------------------
INSERT INTO "SYS_HOTKEY_B" VALUES ('10001', 'hotkey_cancel', 'system', '0', 'Ctrl+Z', '取消编辑的数据', '1', '-1', '-1', '-1', TO_TIMESTAMP('2018-08-14 11:43:59.279000', 'SYYYY-MM-DD HH24:MI:SS:FF6'), '-1', TO_TIMESTAMP('2018-08-14 11:43:59.279000', 'SYYYY-MM-DD HH24:MI:SS:FF6'), '-1');
INSERT INTO "SYS_HOTKEY_B" VALUES ('10002', 'hotkey_delete', 'system', '0', 'Ctrl+D', '删除表格中选中的数据', '1', '-1', '-1', '-1', TO_TIMESTAMP('2018-08-14 11:43:59.346000', 'SYYYY-MM-DD HH24:MI:SS:FF6'), '-1', TO_TIMESTAMP('2018-08-14 11:43:59.346000', 'SYYYY-MM-DD HH24:MI:SS:FF6'), '-1');
INSERT INTO "SYS_HOTKEY_B" VALUES ('10003', 'hotkey_save', 'system', '0', 'Ctrl+S', '保存修改的数据', '1', '-1', '-1', '-1', TO_TIMESTAMP('2018-08-14 11:43:59.407000', 'SYYYY-MM-DD HH24:MI:SS:FF6'), '-1', TO_TIMESTAMP('2018-08-14 11:43:59.407000', 'SYYYY-MM-DD HH24:MI:SS:FF6'), '-1');
INSERT INTO "SYS_HOTKEY_B" VALUES ('10004', 'hotkey_create', 'system', '0', 'Ctrl+G', '新建一条数据', '1', '-1', '-1', '-1', TO_TIMESTAMP('2018-08-14 11:43:59.471000', 'SYYYY-MM-DD HH24:MI:SS:FF6'), '-1', TO_TIMESTAMP('2018-08-14 11:43:59.471000', 'SYYYY-MM-DD HH24:MI:SS:FF6'), '-1');

-- ----------------------------
-- Primary Key structure for table SYS_HOTKEY_B
-- ----------------------------
ALTER TABLE "SYS_HOTKEY_B" ADD CONSTRAINT "SYS_C00143798" PRIMARY KEY ("HOTKEY_ID");

-- ----------------------------
-- Uniques structure for table SYS_HOTKEY_B
-- ----------------------------
ALTER TABLE "SYS_HOTKEY_B" ADD CONSTRAINT "SYS_C00143799" UNIQUE ("CODE", "HOTKEY_LEVEL", "HOTKEY_LEVEL_ID") NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;

