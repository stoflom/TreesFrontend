import { IComment, ICNames, ICHyperlink } from '../interfaces/common'


export interface IFamily {
  name: string;
  cnames?: [ICNames];
  genuslist?: [string];
  comments?: [IComment];
  hyperlinks?: ICHyperlink[];
}

//db queries return IFamilyDocument
export interface IFamilyDocument extends IFamily {
  id: string;  //Added by Mongoose, _id is also available.
  //Virtuals are accessible on FamilyDocument, similar to _id property which are built in by mongoose
}

