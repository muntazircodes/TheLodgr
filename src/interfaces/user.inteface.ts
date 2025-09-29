import { UserRoles } from '../enums/user-role.enum';
export interface IUser {
    id?: string;
    name: string;
    profile?: string;
    aadhaar_number?: string;

    address_line1: string;
    address_line2?: string;
    city: string;
    state: string;
    postal_code: string;
    country?: string;

    phone_primary?: string;
    phone_alternate?: string;

    roles?: UserRoles[];
}
