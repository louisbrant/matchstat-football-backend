export interface Venue {
  name: string,
  city: string,
  capacity: number,
  image_path: string,
}

export interface VenueData {
  data: Venue;
}
