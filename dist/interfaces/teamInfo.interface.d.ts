import { Coach } from './coach.interface';
import { Venue } from './venue.interface';
import { Country } from './country.interface';
import { Rivals } from './rival.interface';
import { Trophies } from './trophy.interface';
export interface TeamInfo {
    data: {
        id: number;
        name: string;
        short_code: string;
        country_id: number;
        logo_path: string;
        country: Country;
        venue: Venue;
        coach: Coach;
        rivals: Rivals;
        trophies: Trophies;
    };
}
