import { InAppBrowser } from '@ionic-native/in-app-browser';
import { SlidesActionsMap } from './../../serverconnect/slideactionmap';
import { Component, ViewChild, OnInit } from '@angular/core';
import { NavController,Slides } from 'ionic-angular';
import { OnBoardingSlide } from '../../classes/onboardingslide';
import { OnBoardingProvider } from '../../providers/on-boarding/on-boarding';
// import { providerDef } from '@angular/core/src/view';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage implements OnInit {
@ViewChild(Slides) slides: Slides;
  onBoardingSlides : OnBoardingSlide[];
  errMsg:string;
  isHidePrevButton:boolean = true;
  constructor(public navCtrl: NavController,
    private onBoardingProvider: OnBoardingProvider, private inAppBrowser: InAppBrowser) {

  }

  ngOnInit():void{
    this.onBoardingProvider.getOnBoardings()
    .subscribe(slides => {this.onBoardingSlides = slides; console.table(slides)} ,
      errMsg => this.errMsg = errMsg);
  }
  
  slideChanged(){
    this.isHidePrevButton = this.slides.isBeginning();
    
  }
  prevSlide(){
    console.log('prev')
    this.slides.slidePrev(400);
  }

  nextSlide(){
    console.log('next')
    this.slides.slideNext(400);
    //this.slides.paginationBulletRender()
    console.log(this.slides.isEnd());
  }
  hasAction(identifier:string):boolean{
    return SlidesActionsMap.has(identifier);
  }
  openActionUrl(identifier:string){
    this.inAppBrowser.create(SlidesActionsMap.get(identifier),'_blank').show();
    console.log(SlidesActionsMap.get(identifier));
  }
}
