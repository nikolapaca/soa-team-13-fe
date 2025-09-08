import { Component, AfterViewInit } from '@angular/core';
import * as L from 'leaflet';

@Component({
  selector: 'app-map',
  templateUrl: './map-component.html',
  styleUrls: ['./map-component.css'],
})
export class MapComponent implements AfterViewInit {
  private map!: L.Map;
  private marker: L.Marker | undefined;

  constructor() {}

  ngAfterViewInit(): void {
    const defaultIcon = L.icon({
      iconUrl: 'https://unpkg.com/leaflet@1.6.0/dist/images/marker-icon.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.6.0/dist/images/marker-shadow.png'
    });
    L.Marker.prototype.options.icon = defaultIcon;

    this.initMap();
  }

  private initMap(): void {
    const savedLat = localStorage.getItem('lat');
    const savedLng = localStorage.getItem('long');

    const initialCoords: L.LatLngTuple =
      savedLat && savedLng
        ? [parseFloat(savedLat), parseFloat(savedLng)]
        : [45.2396, 19.8227];

    this.map = L.map('map', {
      center: initialCoords,
      zoom: 13,
    });

    const tiles = L.tileLayer(
      'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      {
        maxZoom: 18,
        minZoom: 3,
        attribution:
          '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }
    );
    tiles.addTo(this.map);

    if (savedLat && savedLng) {
      this.marker = L.marker(initialCoords).addTo(this.map);
    }

    this.registerOnClick();
  }

  private registerOnClick(): void {
    this.map.on('click', (e: L.LeafletMouseEvent) => {
      const coord = e.latlng;
      const { lat, lng } = coord;

      console.log(
        'Kliknuli ste na mapu na geografskoj širini: ' + lat + ' i dužini: ' + lng
      );

      localStorage.setItem('lat', lat.toString());
      localStorage.setItem('long', lng.toString());

      if (this.marker) {
        this.marker.setLatLng(coord);
      } else {
        this.marker = L.marker(coord).addTo(this.map);
      }
    });
  }
}