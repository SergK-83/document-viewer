export interface DocumentPage {
  number: number;
  imageUrl: string;
}

export interface AnnotationPosition {
  left: number;
  top: number;
}
export interface Annotation {
  id: string;
  text: string;
  position: AnnotationPosition;
}

export interface DocumentView {
  name: string;
  pages: DocumentPage[];
  annotations?: Annotation[];
}