export interface TrailerRegistration {
  vinOrChassisWithMake: string;
  vin: string;
  make: string;
  trn: string;
  certificateExpiryDate: Date;
  certificateIssueDate: Date;
  reasonForDeregistration: string;
  deregisterDate: Date;
}
