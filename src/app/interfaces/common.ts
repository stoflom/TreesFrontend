//Types common to other models

export interface IComment {
    text: string;
    reference?: string;
}

export interface ICNames {
    language: string;
    names: string[];
}

export interface ICHyperlink {
    language: string;
    org: string;
    link: string;
}
