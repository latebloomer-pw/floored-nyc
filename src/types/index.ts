export interface Post {
    id: string
    user_id: string
    title: string
    description: string
    location: string
    encounter_date: string
    contact_method: string
    created_at: string
    updated_at: string
}
export interface Response {
    id: string;
    post_id: string;
    responder_id: string;
    content: string;
    created_at: string;
}