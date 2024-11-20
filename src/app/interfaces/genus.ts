import { IComment, ICNames, ICHyperlink } from '../interfaces/common'


export interface IGenus {
  name: string;
  family?: string;
  cnames?: ICNames[];
  authority?: string;
  comments?: [IComment];
  hyperlinks?: ICHyperlink[];
}


//db queries return IGenusDocument
export interface IGenusDocument extends IGenus {
  id: string;  //Added by Mongoose, _id is also available.
  //Virtuals are accessible on GenusDocument, similar to _id property which are built in by mongoose

}