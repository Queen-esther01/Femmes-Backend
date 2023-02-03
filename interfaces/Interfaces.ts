import { ObjectId } from "bson";

export interface LocationInterface {
    state: string
}

export interface VerificationInterface {
    userId: ObjectId,
    token: string
}

export interface ResetPasswordInterface {
    password: string,
    token: string
}

export interface ProductInterface {
    product: string,
    brands: [string]
}

export interface BrandInterface {
    id: ObjectId
    brand: string,
}

export interface PreferenceInterface {
    sanitaryProduct: ObjectId | string,
    brand: string,
    flowIntensity: string,
    numberOfProducts: number,
    specificIllness?: string,
    additionalInfo?: string
}

export interface userSubscriptionInterface {
    subscriptionId: ObjectId
    userId: string
    type: string
    price: string
}

export interface UserInterface {
    name: string
    email: string
    phone: string
    state: {
        name: string
    }
    password: string,
    generateAuthToken?: any,
    isAdmin?: boolean,
    isVerified: boolean,
    preference?: PreferenceInterface
    subscription?: userSubscriptionInterface
    history?: any[]
}

export interface PackageInterface {
    name: string
    description: string
    price: number
    items: string[]
}

export interface PackageItem {
    id: ObjectId
    item: string
}

export interface DiscountInterface {
    percent: number
    name: string
}

export interface SubscriptionInterface {
    package: {
        name: string
    }
    timeline: any[]
}

export interface TimelineInterface {
    subscriptionId: ObjectId
    type: string
    price: number
}