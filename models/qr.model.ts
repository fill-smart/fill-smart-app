export interface QRModel {
  operationType: 'purchase' | 'refuel' | 'shop_purchase' | 'cash_withdrawal';
  gasStationId: string;
  pumpId: string;
}
