import mongoose, { Schema, model, connect, Document } from 'mongoose';


 export interface ISingleDayHistoricalData extends Document{
      date: Date,
      open: Number,
      high: Number,
      low: Number,
      close: Number,
      adjusted_close: Number,
      volume: Number
 }

 export interface ITimeIntervalHistoricalData extends Document {
    ticker: String,
    start: Date,
    to: Date,
    data  : [ISingleDayHistoricalData]
 }

 export interface IHistoricalDataTickersList extends Document { 
    tickersData : [ITimeIntervalHistoricalData]
 }

const SingleDayHistoricalDataSchema = new Schema<ISingleDayHistoricalData>(
    {
      date: Date,
      open: Number,
      high: Number,
      low: Number,
      close: Number,
      adjusted_close: Number,
      volume: Number
    }
);

const TimeIntervalHistoricalDataSchema = new Schema<ITimeIntervalHistoricalData>(
 { 
  ticker: String,
  start: Date,
  to: Date,
  data : [SingleDayHistoricalDataSchema]
 }, 
 { timestamps: true }
)

const HistoricalDataTickersListSchema = new Schema<IHistoricalDataTickersList>(
  { tickersData : [TimeIntervalHistoricalDataSchema]},
  { timestamps: true }
)



export const SingleDayHistoricalData = mongoose.model<ISingleDayHistoricalData>("SingleDayHistoricalData", SingleDayHistoricalDataSchema);

export const TimeIntervalHistoricalData = mongoose.model<ITimeIntervalHistoricalData>("TimeIntervalHistoricalDataSchema", TimeIntervalHistoricalDataSchema);

export const HistoricalDataTickersList  = mongoose.model<IHistoricalDataTickersList>("HistoricalDataTickersList", HistoricalDataTickersListSchema)

module.exports = { SingleDayHistoricalData , TimeIntervalHistoricalData, HistoricalDataTickersList };
