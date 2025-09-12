export interface Tour {
    id: number,
    name: string,
    difficulty: number,
    description: string,
    cost: number,
    status: number,
    tags: string,
    length: number,
    authorId: string,
    image: string,
    reviews: []
}
