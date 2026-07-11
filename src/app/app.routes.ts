import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home';
import { WisdomComponent } from './pages/about_us/wisdom/wisdom';
import { OurGuruComponent } from './pages/about_us/our-guru/our-guru';
import { EmotionalWellnessComponent } from './pages/services/emotional-wellness/emotional-wellness';
import { PhysicalWellnessComponent } from './pages/services/physical-wellness/physical-wellness';
import { SpiritualWellnessComponent } from './pages/services/spiritual-wellness/spiritual-wellness';
import { TherapeuticWellnessComponent } from './pages/services/therapeutic-wellness/therapeutic-wellness';
import { EnvironmentComponent } from './pages/social_impacts/environment/environment';
import { FarmerSupportComponent } from './pages/social_impacts/farmer-support/farmer-support';
import { LivelihoodComponent } from './pages/social_impacts/livelihood/livelihood';
import { RuralHealthcareComponent } from './pages/social_impacts/rural-healthcare/rural-healthcare';
import { NewsComponent } from './pages/news/news';
import { ContactComponent } from './pages/contact/contact';
import { AppontmentComponent } from './pages/appontment/appontment';
import { MemberComponent } from './pages/member/member';
import { SkincareComponent } from './pages/stores/skincare/skincare';
import { StoreDetailsComponent } from './pages/stores/store-details/store-details';
import { AllProductsComponent } from './pages/stores/all-products/all-products';
import { DonationComponent } from './pages/donation/donation';
import { SitemapComponent } from './pages/sitemap/sitemap';
import { AuraMechanismComponent } from './pages/services/aura-mechanism/aura-mechanism';

export const routes: Routes = [

    {path:'home',component:HomeComponent},
    {path:'',component:HomeComponent},
    {path:'our-guru',component:OurGuruComponent},
    {path:'wisdom',component:WisdomComponent},
    {path:'emotional-wellness',component:EmotionalWellnessComponent},
    {path:'physical-wellness',component:PhysicalWellnessComponent},
    {path:'spiritual-wellness',component:SpiritualWellnessComponent},
    {path:'therapeutic-wellness',component:TherapeuticWellnessComponent},
    {path:'environment',component:EnvironmentComponent},
    {path:'farmer-support',component:FarmerSupportComponent},
    {path:'livelihood',component:LivelihoodComponent},
    {path:'rural-healthcare',component:RuralHealthcareComponent},
    {path:'news',component:NewsComponent},
    {path:'contact',component:ContactComponent},
    {path:'appointment',component:AppontmentComponent},
    {path:'member',component:MemberComponent},
    {path:'store/:category',component:SkincareComponent},
    {path:'store-details',component:StoreDetailsComponent},
    {path:'allproducts',component:AllProductsComponent},
    {path:'donation',component:DonationComponent},
    {path:'sitemap',component:SitemapComponent},
    {path:'aura-mechanism',component:AuraMechanismComponent}


];