import { createDirectus, rest } from '@directus/sdk';

type Global = {
  title: string;
  description: string;
}

type Author = {
  name: string
}

type Page = {
  title: string;
  content: string;
  slug: string;
}

type Category = {
  id: number;
  nome: string;
  slug: string;
}

type Post = {
  image: string;
  title: string;
  author: Author;
  content: string;
  published_date: string;
  slug: string;
  categoria: Category | null;
}

type Schema = {
  posts: Post[];
  global: Global;
  pages: Page[];
  categorias: Category[];
}

const directus = createDirectus<Schema>('https://directus.tuacasasegura.com.br').with(rest());

export default directus;