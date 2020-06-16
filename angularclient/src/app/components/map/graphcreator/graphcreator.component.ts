import {Component, OnDestroy, OnInit} from '@angular/core';
import { Polygon } from '../../../model/MapAreas/Polygons/Polygon';
import { Stand } from '../../../model/Stand/Stand';
import {MapService} from '../../../services/map.service';
import * as L from 'leaflet';
import {Marker} from 'leaflet/src/layer/marker/Marker.js';
import '../../../../../node_modules/leaflet-contextmenu/dist/leaflet.contextmenu.js'
import '../../../../lib/leaflet-easybutton/src/easy-button';
import {Graph} from '../../../model/Graphs/Graph';
import {Edge} from '../../../model/Graphs/Edge';
import {Vertex} from '../../../model/Graphs/Vertex';
import {GraphService} from "../../../services/graph.service";
import { PolygonService } from '../../../services/polygon.service';
import { StandService } from '../../../services/stand.service';
import { axisAngleFromQuaternion, StoreService } from '../../../services/store.service';
import { ARROWICON, CIRCLEBACK, STANDICON, WAYPOINTICON } from '../map.component';
import {ToastrService} from "ngx-toastr";
import {fromEvent} from "rxjs";


@Component({
  selector: 'app-graphcreator',
  templateUrl: './graphcreator.component.html',
  styleUrls: ['./graphcreator.component.css']
})
export class GraphcreatorComponent implements OnInit, OnDestroy {

  dataLoaded = false;
  graph = null;
  private editEdges = false;
  private graphID;

  private vertices: Marker[] = [];
  private selectedVert = null;
  selectedElement = null;
  private edges = [];
  private readonly context;

  //Map related variables
  private map;
  private imageURL = '';
  private mapResolution = 0.01;//TODO()
  private imageResolution;
  private mapContainerSize = 800;
  private subscription;
  private polygons = [];

  private standLayer = L.featureGroup();

  private overlays = {
    Stanowiska: this.standLayer,
  };

  constructor(private mapService: MapService,
              private graphService: GraphService,
              private store: StoreService,
              private toast: ToastrService,
              private polygonService: PolygonService,
              private standService: StandService) {
    this.context = this;
  }

  ngOnInit() {
    this.loadMap();
    this.subscription = fromEvent(window, 'resize').subscribe(() => this.onResize());
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  onResize() {
    const mapContainer = document.getElementById('map-container');
    this.mapContainerSize = mapContainer.clientWidth;
  }

  private loadMap() {
    if (localStorage.getItem(this.store.mapID) !== null) {
      this.afterMapLoaded(localStorage.getItem(this.store.mapID))
    } else {
      this.mapService.getMap(this.store.mapID).subscribe(
        data => {
          this.afterMapLoaded(data);
          localStorage.setItem(this.store.mapID, data)
        }
      );
    }
  }

  private afterMapLoaded(data: String) {
    this.dataLoaded = true;
    this.imageURL = 'data:image/jpg;base64,' + data;
    this.initMap();

    const img = new Image;
    img.src = this.imageURL;
    img.onload = () => {
      this.imageResolution = img.width;
      //
    }

    this.polygonService.getPolygons().subscribe(
      polygons => {
        this.drawPolygons(polygons);
      }
    );

    this.standService.getAll().subscribe(
      stands => {
        this.drawStand(stands);
      }
    );
  }

  private isMarkerInsidePolygon(latlng, poly): boolean {
    var inside = false;
    var x = latlng.lat, y = latlng.lng;
    for (var ii=0;ii<poly.getLatLngs().length;ii++){
      var polyPoints = poly.getLatLngs()[ii];
      for (var i = 0, j = polyPoints.length - 1; i < polyPoints.length; j = i++) {
        var xi = polyPoints[i].lat, yi = polyPoints[i].lng;
        var xj = polyPoints[j].lat, yj = polyPoints[j].lng;

        var intersect = ((yi > y) != (yj > y))
          && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
        if (intersect) inside = !inside;
      }
    }

    return inside;
  };

  private drawPolygon(polygon: Polygon) {

    let existingPolygonpoints = [];
    polygon.points.forEach(point => {
      const pointPosition = L.latLng([this.getMapCoordinates(point.x), this.getMapCoordinates(point.y)]);
      existingPolygonpoints.push(pointPosition);

    });
    let polygonik = L.polygon(existingPolygonpoints, {color: polygon.type.color}).bindTooltip(polygon.type.name, {
      sticky: true // If true, the tooltip will follow the mouse instead of being fixed at the feature center.
    });
    polygonik.addTo(this.map);
    this.polygons.push(polygonik);
  }


  private drawPolygons(polygon: Polygon[]) {
    polygon.forEach(object => {
      this.drawPolygon(object);
    });
  }

  private drawStand(stands: Stand[]) {
    stands.forEach(stand => {
      const position = [
        this.getMapCoordinates(Number(stand.pose.position.y)),
        this.getMapCoordinates(Number(stand.pose.position.x))
      ];
      let circleMarker = L.marker(position, {icon: CIRCLEBACK});
      circleMarker.addTo(this.standLayer);
      let marker = L.marker(position, {icon: STANDICON});
      marker.addTo(this.standLayer);
      let orientationMarker = L.marker(position, {
        icon: ARROWICON,
        rotationAngle: axisAngleFromQuaternion(stand.pose.orientation) * 180 / Math.PI
      });
      orientationMarker.addTo(this.standLayer);
      marker.bindPopup(
        'Stand Details<br />Position x: '
        + stand.pose.position.x
        + '<br />Position y: ' +
        +stand.pose.position.y
        + '<br />Orientation: ' +
        +stand.pose.position.z
        + '<br />Status: ' +
        +stand.standStatus.name
        + '<br />Parking type: ' +
        +stand.parkingType.name
        + '<br />Stand type: ' +
        +stand.standType.name);
    })
  }

  private initMap(): void {
    const imageBounds = [[0, 0], [ this.mapContainerSize,  this.mapContainerSize]];
    this.map = L.map('map', {
      crs: L.CRS.Simple,
      contextmenu: true,
      layers: [this.standLayer]
    });
    L.imageOverlay(this.imageURL, imageBounds).addTo(this.map);
    L.easyButton('fa-crosshairs', function (btn, map) {
      map.setView([400, 400], 0);
    }).addTo(this.map);
    this.map.fitBounds(imageBounds);
    L.control.layers({}, this.overlays).addTo(this.map);

    this.addContextMenuShowHandler();
    this.map.on('click', e => {
      if (!this.editEdges) {
        const insidePoly = this.polygons.some(polygon => this.isMarkerInsidePolygon(e.latlng, polygon));
        if (insidePoly) {
          this.toast.error('Nie można stworzyć wierzchołka na obszarze zabronionym');
        } else {
          this.createNewMarker(e.latlng);
        }
      }
    });
  }

  private createNewMarker(position: L.latlng) {
    let marker = new L.marker(position, {
      draggable: true,
      icon: WAYPOINTICON,
      contextmenu: true,
      contextmenuItems: [
        {
          text: 'Usuń punkt trasy',
          callback: this.deleteMarker,
          context: this
        }
      ]
    });

    marker.on('click', e => {
      this.createEdge(e)
    });
    marker.on('move', e => {
      const isInside = this.polygons.some(poly => this.isMarkerInsidePolygon(e.latlng, poly));
      if (isInside) {
        this.toast.error('Nie można przesunąć wierzchołka na obszarz zabroniony');
        this.deleteMarker({ ...e, relatedTarget: e.target  });
      } else {
        this.updateEdge(e)
      }
    });

    marker.addTo(this.map);
    this.vertices.push(marker);
    return marker;
  }

  updateMarkers() {

  }

  private updateEdge(e) {
    let markerPos = this.vertices.filter(marker => marker._leaflet_id === e.target._leaflet_id)[0];
    let newEdges = [];
    this.edges.forEach(edge => {
      if (edge.markerIDs[0] === e.target._leaflet_id) {
        edge.setLatLngs([markerPos._latlng, edge._latlngs[1]]);
        edge.redraw()
      }
      if (edge.markerIDs[1] === e.target._leaflet_id) {
        edge.setLatLngs([edge._latlngs[0], markerPos._latlng]);
        edge.redraw()
      }
      newEdges.push(edge);
    });
    this.edges = newEdges;
  }

  private addContextMenuShowHandler() {
    this.map.on('contextmenu.show', (event) => {
      if (event.relatedTarget !== null && event.relatedTarget !== undefined) {
        this.selectedElement = event.relatedTarget;
      }
    });
  }

  private createEdge(marker) {
    if (this.editEdges) {
      if (this.selectedVert != null && this.selectedVert._leaflet_id !== marker.sourceTarget._leaflet_id) {

        const polyLine = new L.polyline([this.selectedVert._latlng, marker.sourceTarget._latlng], {
          color: 'red',
          weight: 7,
          opacity: 0.8,
          smoothFactor: 1,
          contextmenu: true,
          contextmenuItems: [
            {
              text: 'Usuń krawędź grafu',
              callback: this.deleteEdge,
              context: this.context
            },
            {
              text: 'Drukierunkowa: Tak/Nie',
              callback: this.biDirectEdge,
              context: this.context
            }
          ]
        });
        polyLine.addTo(this.map);
        polyLine.markerIDs = [this.selectedVert._leaflet_id, marker.sourceTarget._leaflet_id]
        polyLine.biDirected = false;
        this.edges.push(polyLine);
        this.selectedVert = null;
      } else {
        this.selectedVert = marker.sourceTarget;
      }
    }
  }


  private deleteMarker(e) {
    this.vertices = this.vertices.filter(marker => marker !== e.relatedTarget);
    this.map.removeLayer(e.relatedTarget);
    //Remove related edges
    let tempEdges = this.edges;
    this.edges.forEach(edge => {
      if (e.relatedTarget.getLatLng() === edge._latlngs[0] || e.relatedTarget.getLatLng() === edge._latlngs[1]) {
        tempEdges = tempEdges.filter(tempEdge => tempEdge !== edge);
        this.map.removeLayer(edge);
      }
    });
    this.edges = tempEdges;
  }

  private deleteEdge() {
    this.edges = this.edges.filter(edge => edge !== this.selectedElement);
    this.map.removeLayer(this.selectedElement);
  }

  private biDirectEdge() {
    const index = this.edges.indexOf(this.selectedElement);
    if (!this.selectedElement.biDirected) {
      this.selectedElement.biDirected = true;
      this.selectedElement.setStyle({color: 'yellow'});
    } else {
      this.selectedElement.biDirected = false;
      this.selectedElement.setStyle({color: 'red'});
    }
    this.edges[index] = this.selectedElement;
  }

  public saveGraph() {
    if (this.edges.length + 1 < this.vertices.length) {
      this.toast.error('Graf musi być spójny');
      return;
    }

    let graph: Graph = new Graph();
    let graphEdges: Edge[] = [];
    this.edges.forEach(edge => {
      let vertexA: Vertex = new Vertex(
        this.getRealCoordinates(edge._latlngs[0].lng),
        this.getRealCoordinates(edge._latlngs[0].lat)
      );
      let vertexB: Vertex = new Vertex(
        this.getRealCoordinates(edge._latlngs[1].lng),
        this.getRealCoordinates(edge._latlngs[1].lat)
      );
      let graphEdge = new Edge(vertexA, vertexB, edge.biDirected);
      graphEdges.push(graphEdge)
    });
    graph.edges = graphEdges;
    if (this.graphID) graph.id = this.graphID;
    this.graphService.save(graph).subscribe(result => {
      this.graph = graph;
      this.toast.success('Graf zapisany w bazie')
    });
  }

  getRealCoordinates(value: number) {
    return (value * this.mapResolution * (this.imageResolution / this.mapContainerSize) - ((this.imageResolution * this.mapResolution) / 2))
  }

  getMapCoordinates(value) {
    return ((value) + (this.imageResolution * this.mapResolution) / 2) * (1 / this.mapResolution) * (this.mapContainerSize / this.imageResolution)
  }

  clearMap() {
    this.vertices.map(marker => this.map.removeLayer(marker));
    this.edges.map(edge => this.map.removeLayer(edge));
    this.vertices = [];
    this.edges = [];
    this.graphID = null;
  }

  editExistingGraph(graph: Graph) {
    this.clearMap();
    if (!graph) return;
    this.graphID = graph.id;
    let existingWaypoints = [];
    let marker1;
    let marker2;
    let markers = [];
    graph.edges.forEach(edge => {
      let marker1Temp = marker1;
      let marker2Temp = marker2;
      const vertPosA = L.latLng([this.getMapCoordinates(edge.vertexA.posY), this.getMapCoordinates(edge.vertexA.posX)]);
      const vertPosB = L.latLng([this.getMapCoordinates(edge.vertexB.posY), this.getMapCoordinates(edge.vertexB.posX)]);

      if (!existingWaypoints.includes(vertPosA + '')) {//toString in order to not mind about reference
        marker1 = this.createNewMarker(vertPosA);
        markers.push(marker1);
        existingWaypoints.push(vertPosA + '');
      }
      if (!existingWaypoints.includes(vertPosB + '')) {
        marker2 = this.createNewMarker(vertPosB);

        markers.push(marker2);
        existingWaypoints.push(vertPosB + '');
      }
    });
    graph.edges.forEach(edge => {
      const vertPosA = L.latLng([this.getMapCoordinates(edge.vertexA.posY), this.getMapCoordinates(edge.vertexA.posX)]);
      const vertPosB = L.latLng([this.getMapCoordinates(edge.vertexB.posY), this.getMapCoordinates(edge.vertexB.posX)]);
      marker1 = markers.find(marker => JSON.stringify(marker._latlng) === JSON.stringify(vertPosA));
      marker2 = markers.find(marker => JSON.stringify(marker._latlng) === JSON.stringify(vertPosB));
      this.drawEditableEdge(marker1, marker2, edge.biDirected)
    })
  }

  drawEditableEdge(marker1, marker2, biDirected: boolean) {
    const color = biDirected ? 'yellow' : 'red';
    const polyLine = new L.polyline([marker1._latlng, marker2._latlng], {
      color: color,
      weight: 7,
      opacity: 0.8,
      smoothFactor: 1,
      contextmenu: true,
      contextmenuItems: [
        {
          text: 'Usuń krawędź grafu',
          callback: this.deleteEdge,
          context: this.context
        },
        {
          text: 'Drukierunkowa: Tak/Nie',
          callback: this.biDirectEdge,
          context: this.context
        }
      ]
    });
    polyLine.addTo(this.map);
    polyLine.markerIDs = [marker1._leaflet_id, marker2._leaflet_id]
    polyLine.biDirected = biDirected;
    this.edges.push(polyLine);
  }

}
