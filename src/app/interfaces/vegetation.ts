export interface IVegetation  {
  abbreviation: string;
  description: string;
  name: string;
}

//db queries return IVegetationDocument
export interface IVegetationDocument extends IVegetation {
  id: string;  //Added by Mongoose, _id is also available.
  //Virtuals are accessible on VegetationDocument, similar to _id property which are built in by mongoose
}