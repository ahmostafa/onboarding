import { InAppBrowser } from '@ionic-native/in-app-browser';
import { SlidesActionsMap } from './../../serverconnect/slideactionmap';
import { Component, ViewChild, OnInit } from '@angular/core';
import { NavController,Slides, Platform } from 'ionic-angular';
import { OnBoardingSlide } from '../../classes/onboardingslide';
import { OnBoardingProvider } from '../../providers/on-boarding/on-boarding';
import { WelcomescreenPage } from '../welcomescreen/welcomescreen';
import { NativePageTransitions,NativeTransitionOptions } from '@ionic-native/native-page-transitions';
import {Storage} from '@ionic/storage';
import { Subscription } from 'rxjs/Subscription';
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
  isLastSlide:boolean=false;
  lastSlideIndexBeforeLeaveValue = -1;
  lastSlideIndexBeforeLeaveKey = "slideindex";
  onPausSubscription: Subscription;
   transitionOptions : NativeTransitionOptions = {
    duration:400,
    androiddelay:0,
    iosdelay:0,
    href:null
    
  }
  constructor(public navCtrl: NavController,private nativePageTransitions: NativePageTransitions,
    private onBoardingProvider: OnBoardingProvider, private inAppBrowser: InAppBrowser, 
    private storage: Storage, private platform:Platform) {

      this.storage.get(this.lastSlideIndexBeforeLeaveKey).then(index=>{
        this.lastSlideIndexBeforeLeaveValue=index?index:-1;
        
      });
      this.onPausSubscription = this.platform.pause.subscribe(()=>{
        if(!this.lastSlideIndexBeforeLeaveValue || this.lastSlideIndexBeforeLeaveValue===-1){
          console.log(`lastSlideIndexBeforeLeaveKey ${this.lastSlideIndexBeforeLeaveKey} index ${this.slides.getActiveIndex()} `)
          this.storage.set(this.lastSlideIndexBeforeLeaveKey,this.slides.getActiveIndex())
          
        }
      });
  }

  ngOnInit():void{
    this.onBoardingProvider.getOnBoardings()
    .subscribe(slides => {this.onBoardingSlides = slides; console.table(slides);
      if(this.lastSlideIndexBeforeLeaveValue&&this.lastSlideIndexBeforeLeaveValue!=-1){
        this.goToLastSlide();// can't call slide to directrly from here 
      }
    } ,
      errMsg => this.errMsg = errMsg);
  }
  ngOnDestroy(): void {
    this.onPausSubscription.unsubscribe();
  }
  slideChanged(){
    this.isHidePrevButton = this.slides.isBeginning();
    this.isLastSlide = this.slides.isEnd();// because this is called after the slide already change  //&&this.slides.getActiveIndex()=== (this.slides.length()-1)
    console.log('this.lastSlideIndexBeforeLeaveValue '+this.lastSlideIndexBeforeLeaveValue);
    // if(!this.lastSlideIndexBeforeLeaveValue || this.lastSlideIndexBeforeLeaveValue===-1){
    //   this.storage.set(this.lastSlideIndexBeforeLeaveKey,this.slides.getActiveIndex())
    //   console.log(`lastSlideIndexBeforeLeaveKey ${this.lastSlideIndexBeforeLeaveKey} index ${this.slides.getActiveIndex()} `)
    // }
  }
  prevSlide(){
    console.log('prev')
    this.slides.slidePrev(400);
  }

  nextSlide(){
    console.log('next')
    this.slides.slideNext(400);
    //this.slides.paginationBulletRender()
    console.log(this.slides.getPreviousIndex());
    
    if( this.isLastSlide){
      this.nativePageTransitions.fade(this.transitionOptions);
      this.navCtrl.push(WelcomescreenPage,null,{animate:false});
    }
    console.log(this.slides.isEnd());
  }
  hasAction(identifier:string):boolean{
    return SlidesActionsMap.has(identifier);
  }
  openActionUrl(identifier:string){
    let inAppBrowserRef=this.inAppBrowser.create(SlidesActionsMap.get(identifier),'_blank');
    inAppBrowserRef.show();
    inAppBrowserRef.on('loaderror').subscribe(event=>{
      inAppBrowserRef.executeScript({code:"alert('Error in load:"+SlidesActionsMap.get(identifier) +" "+event.message +" ');"})
      // inAppBrowserRef.executeScript({code:"document.body.innerHTML+='<div style='position:absolute;width:100%;height:100%;opacity:0.3;z-index:100;background:#000;'>"+event.message+"</div>'"})
    })
    // inAppBrowserRef.on('loaderror').subscribe(event=>{
    //   let scriptErrorMesssage = this.createMsg('Sorry we cannot open that page. Message from the server is: '
    //   + event.message);
    //   inAppBrowserRef.executeScript({code:scriptErrorMesssage});
    // })
   // inAppBrowserRef.show();
    
    
    console.log(SlidesActionsMap.get(identifier));
  }

   createMsg(msg) {
    return 'var div = document.createElement("div");'
         + 'div.style.position = "absolute";'
         + 'div.style.top = "50%";'
         + 'div.style.left = "50%";'
         + 'div.style.width = "100px";'
         + 'div.style.height = "100px";'
         + 'div.style.color = "#f00";'
         + 'div.innerHTML = "' + msg + '";'
         + 'document.appendChild(div);'
  }
//   executeScriptCallBack(params) {

//     if (params[0] == null) {

//         $('#status-message').text(
//            "Sorry we couldn't open that page. Message from the server is : '"
//            + params.message + "'");
//     }

// }
  goToLastSlide(){
    setTimeout(() => {
      this.slides.slideTo(this.lastSlideIndexBeforeLeaveValue); 
      this.lastSlideIndexBeforeLeaveValue=-1;
    }, 500); // this time out to slide to after the slides is ready
  
  }
  ionViewWillEnter(){
    console.log('will enter');
  }
  ionViewDidEnter(){
    console.log('did enter');
  }
  
  ionViewWillLeave(){
   console.log('will leave');
  // this.storage.set(this.lastSlideIndexBeforeLeaveKey,this.slides.getActiveIndex());
   console.log(this.slides.getActiveIndex());
  }
  ionViewDidLeave(){
    console.log('did leave');
  }
}
