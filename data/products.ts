export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
}

const products: Product[] = [
  {
    id: 1,
    name: 'Daikin FTXB35C',
    description: 'Инверторная сплит-система, до 35 м²',
    price: 49900,
    image: '/images/ac1.png',
  },
  {
    id: 2,
    name: 'LG Mega Plus P07SP',
    description: 'Настенный кондиционер, до 20 м²',
    price: 39900,
    image: '/images/ac2.png',
  },
  {
    id: 3,
    name: 'Mitsubishi MSZ-HJ35VA',
    description: 'Инверторная сплит-система, до 35 м²',
    price: 58900,
    image: '/images/ac3.png',
  },
];

export default products;
