import { Component, ViewChild, OnInit } from '@angular/core';
import { NavController,Slides } from 'ionic-angular';
import { OnBoardingSlide } from '../../classes/onboardingslide';
import { OnBoardingProvider } from '../../providers/on-boarding/on-boarding';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage implements OnInit {
@ViewChild(Slides) slides: Slides;
  onBoardingSlides : OnBoardingSlide[];
  errMsg:string;
  constructor(public navCtrl: NavController,
    private onBoardingProvider: OnBoardingProvider) {

  }

  ngOnInit():void{
    this.onBoardingProvider.getOnBoardings()
    .subscribe(slides => {this.onBoardingSlides = slides; console.table(slides)} ,
      errMsge => this.errMsg = this.errMsg);
  }
  prevSlide(){
    console.log('prev')
    this.slides.slidePrev();
  }

  nextSlide(){
    console.log('next')
    this.slides.slideNext();
  }
}
