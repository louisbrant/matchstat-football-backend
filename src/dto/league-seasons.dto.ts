import {IsArray, IsNumber} from 'class-validator';
export class LeagueSeasonsDto {
    @IsArray()
    @IsNumber({},{each:true})
    seasonIds: number[];
}
