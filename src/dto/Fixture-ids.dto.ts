import {IsArray, IsNumber} from 'class-validator';
export class FixtureIdsDto {
    @IsArray()
    @IsNumber({},{each:true})
    fixtureIds: number[];
}
