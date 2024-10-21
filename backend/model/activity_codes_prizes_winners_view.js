const Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  return activityCodesPrizesWinnersView.init(sequelize, DataTypes);
}

class activityCodesPrizesWinnersView extends Sequelize.Model {
  static init(sequelize, DataTypes) {
  return sequelize.define('activityCodesPrizesWinnersView', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      field: 'Id'
    },
    winnerName: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: 'WinnerName'
    },
    phone: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: 'Phone'
    },
    isExchange: {
      type: DataTypes.TINYINT,
      allowNull: false,
      field: 'IsExchange'
    },
    activityId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'ActivityId'
    },
    activityName: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: 'ActivityName'
    },
    codeId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'CodeId'
    },
    code: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: 'Code'
    },
    prizeId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'PrizeId'
    },
    prizeName: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: 'PrizeName'
    },
    prizeTime: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: 'PrizeTime'
    },
    price: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: 'Price'
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'Quantity'
    },
    expiryDate: {
      type: DataTypes.DATE,
      allowNull: false,
      field: 'ExpiryDate'
    },
    createTime: {
      type: DataTypes.DATE,
      allowNull: false,
      field: 'CreateTime'
    }
  }, {
    tableName: 'Activity_Codes_Prizes_Winners_View',
    schema: 'dbo',
    timestamps: false
  });
  }
}
