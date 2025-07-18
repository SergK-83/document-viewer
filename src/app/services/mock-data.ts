import { DocumentView } from "../models/model";

export const MOCK_DATA: DocumentView = {
  name: 'test doc',
  pages: [
    {
      number: 1,
      imageUrl: 'assets/pages/1.png',
    },
    {
      number: 2,
      imageUrl: 'assets/pages/2.png',
    },
    {
      number: 3,
      imageUrl: 'assets/pages/3.png',
    },
    {
      number: 4,
      imageUrl: 'assets/pages/4.png',
    },
    {
      number: 5,
      imageUrl: 'assets/pages/5.png',
    },
  ],
  annotations: [
    {
      id: '1752305459352',
      text: 'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.',
      position: {
        top: 207,
        left: 162,
      },
    },
    {
      id: '1752305497649',
      text: 'Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for "lorem ipsum" will uncover many web sites still in their infancy.',
      position: {
        top: 320,
        left: 530,
      },
    },
    {
      id: '1752305505079',
      text: 'Where can I get some?',
      position: {
        top: 427,
        left: 97,
      },
    },
  ],
};
