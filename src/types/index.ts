export type role='contributor'|'maintainer';

export interface jwtPayload{
    id:string
    name:string
    role:role
}

declare global{
    namespace Express{
        interface request{
            user?:jwtPayload
        }
    }
}