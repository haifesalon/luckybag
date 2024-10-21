const Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  return action.init(sequelize, DataTypes);
}

class action extends Sequelize.Model {
  static init(sequelize, DataTypes) {
  return sequelize.define('action', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      field: 'ID'
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: 'Name'
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
    tableName: 'Action',
    schema: 'dbo',
    timestamps: false,
    indexes: [
      {
        name: "PK_Action",
        unique: true,
        fields: [
          { name: "ID" },
        ]
      },
    ]
  });
  }
}
