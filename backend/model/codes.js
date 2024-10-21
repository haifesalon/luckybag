const Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  return codes.init(sequelize, DataTypes);
}

class codes extends Sequelize.Model {
  static init(sequelize, DataTypes) {
  return sequelize.define('codes', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      field: 'ID'
    },
    code: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: 'Code'
    },
    activityId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Activity',
        key: 'ID'
      },
      field: 'ActivityId'
    },
    modifyId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
      field: 'ModifyId'
    },
    modifyTime: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.Sequelize.fn('getdate'),
      field: 'ModifyTime'
    },
    createId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
      field: 'CreateId'
    },
    createTime: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.Sequelize.fn('getdate'),
      field: 'CreateTime'
    }
  }, {
    tableName: 'Codes',
    schema: 'dbo',
    timestamps: false,
    indexes: [
      {
        name: "PK_Codes",
        unique: true,
        fields: [
          { name: "ID" },
        ]
      },
    ]
  });
  }
}
