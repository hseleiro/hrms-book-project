export interface Product {
  id?: number,
  name: string,
  seller: 'Pc Components' | 'Pcdiga',
  owner?: string;
  sold?: boolean;
  nif?: number;
  deleted?: boolean;
  like?: number
  dislike?: number
  totalLikes?: number
  categories?: Category[]
}

interface Category {
  id: number,
  name: string,
  selected: boolean
}
