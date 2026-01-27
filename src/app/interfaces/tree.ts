import { IComment, ICNames, ICHyperlink } from '../interfaces/common'
import { IVegetationDocument } from '../interfaces/vegetation'

export interface ITreeGenus {
    name: string;
    id?: string;
}

export interface ISpecies {
    name: string;
    authority?: string;
}

export interface ISynonym {
    genus: string;
    species: ISpecies;
    subspecies?: ISpecies;
    variety?: ISpecies;
}

export interface ITree {
    // _id?: string             //canot declare optional here
    //since it is not-optional in Document by mongoose, so if declared here will be required
    //what is returned from MongoDB is always a TreeDocument with _id included.
    genus: ITreeGenus;
    species: ISpecies;
    subspecies?: ISpecies;
    variety?: ISpecies;
    comments?: IComment[];
    FSAnumber?: string;
    Znumber?: string;
    synonyms?: ISynonym[];
    cnames?: ICNames[];
    vegtypes?: IVegetationDocument[];
    group?: string[];
    hyperlinks?: ICHyperlink[];
}


//db detail queries return ITreeDocument which is ITree extended by virtual fields
export interface ITreeDocument extends ITree {
    id: string; //Added by Mongoose, _id is also available.
    //Virtuals are accessible on TreeDocument, similar to _id property which are built in by mongoose
    //  binomial: (this: ITreeDocument) => string;
    identity?: string;
    scientificName?: string;
    firstname?: string;
}