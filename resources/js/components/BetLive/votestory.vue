<template>
<v-card fluid class="fill-height" id="main_content">
                <v-dialog
                transition="dialog-top-transition"
                max-width="600"
                overlay-opacity="0.8"
                v-model="dialog"
                >
                    <template v-slot:activator="{ on, attrs }">
                    <v-btn
                        color="green"
                        v-bind="attrs"
                        v-on="on"
                        id="options_tab"
                    ><v-icon>{{icons.mdiCog}}</v-icon></v-btn>
                    </template>
                    <v-card id="dialog_box">
                        <v-card-title class="card_title justify-center">
                            Opcije
                        </v-card-title>
                        <v-form @submit.prevent="change_resolution" ref="form">
                            <v-col class="d-flex" cols="12" sm="6">
                                <v-radio-group v-model="resolution_form">
                                    <v-radio
                                        dark
                                        :off-icon="resolution.id==resolution_form.id ? '$radioOn' : '$radioOff'"
                                        name="resolution_form"
                                        v-for="resolution in template_resolutions"
                                        :key="resolution.id"
                                        :label="`${resolution.width}x${resolution.height}`"
                                        :value="resolution"
                                    ></v-radio>
                                </v-radio-group>
                            </v-col>
                            <v-card-actions>
                                <v-spacer></v-spacer>
                            <v-btn
                            id="login-button"
                            class="mr-4"
                            type="submit"
                            @click="dialog = false"
                            >
                            POTVRDI
                            </v-btn>
                            </v-card-actions>
                        </v-form>
                    </v-card>
                </v-dialog>
    <v-btn id="screenshot" @click="download_image()"><v-icon>{{icons.mdiCamera}}</v-icon></v-btn>
    <v-btn style="font-family: BetLiveMedium; float:right">{{current_template.name}}</v-btn>
    <canvas ref="canvas" class="div_to_capture" id="div_to_capture916"
    width="278.4375px"
    height="495px"
    v-if="resolution"
    >
    </canvas>
    <canvas ref="canvas2" id="div_to_capture2"
    :width="resolution.width"
    :height="resolution.height"
    v-if="resolution"
    >
    </canvas>
</v-card>
</template>

<script>
import {
    mdiCamera,
    mdiCog
  } from '@mdi/js'
import { mapGetters } from 'vuex'

export default{

data: () => ({
    resolution_form: {
        id: null,
        width: null,
        height: null,
        aspect_id: null
    },
    dialog: false,
    icons: {
            mdiCamera,
            mdiCog
    },
    canvas: null,
    context: null,
    canvas2: null,
    context2: null,
}),

computed: {
    ...mapGetters({
        current_background: 'backgrounds/currentBackground',
        selected_matches: 'matches/selectedMatches',
        current_template: 'templates/currentTemplate',
        my_backgrounds: 'backgrounds/myBackgrounds',
        other_backgrounds: 'backgrounds/otherBackgrounds',
        resolution: 'templateOptions/resolution',
        template_resolutions: 'templateOptions/templateResolutions',
    }),
},

methods: {
        download_image(){

            var img = document.createElement('a');
            img.href = this.$refs.canvas2.toDataURL("image/png");
            if(this.selected_matches!=null){
                img.download = this.selected_matches[0].home_team.name+this.selected_matches[0].away_team.name+this.selected_matches[0].date+this.selected_matches[0].time+'.png';
            }
            else{
                img.download = "no_selected_matches.png";
            }
            img.click();
        },

        change_resolution(){
            this.$store.dispatch('templateOptions/changeResolution', this.resolution_form);
        },

        get_template_options(){
          return  this.$store.dispatch('templateOptions/getTemplateResolutions', this.current_template.aspect_id);
        },
        create_displayed_canvas(){
                        //canvas to show
                this.canvas=this.$refs.canvas;
                this.context=this.canvas.getContext('2d');
                var ctx=this.context;
                ctx.font = "28px BetLiveMedium";
                ctx.fillStyle="white";
                var background_image = new Image();
                let canvas_width=this.canvas.width;
                let canvas_height=this.canvas.height;
                if(this.selected_matches!=null){
                    var match=this.selected_matches[0];
                }
                background_image.src = 'storage/backgrounds/'+this.current_background.url;
                background_image.onload = function(){
                    let scale = Math.max(canvas_width / this.width, canvas_height / this.height);
                    let x = (canvas_width / 2) - (this.width / 2) * scale;
                    let y = (canvas_height / 2) - (this.height / 2) * scale;
                    ctx.drawImage(background_image, x, y, this.width * scale, this.height * scale);
                    if(match!=null){
                        let home_team_name= match.home_team.name.toUpperCase();
                        let away_team_name= match.away_team.name.toUpperCase();
                        let home_team_name_width=ctx.measureText(home_team_name);
                        let away_team_name_width=ctx.measureText(away_team_name);
                        if(home_team_name_width.width>128){
                            var array1 = home_team_name.split(" ");
                            let array1_1_width=ctx.measureText(array1[0]);
                            let array1_2_width=ctx.measureText(array1[1]);
                            let font_size=28;
                            while(ctx.measureText(array1[0]).width>128 || ctx.measureText(array1[1]).width>128){
                                font_size--;
                                ctx.font=font_size+"px BetLiveMedium";
                                array1_1_width=ctx.measureText(array1[0]);
                                array1_2_width=ctx.measureText(array1[1]);
                            }
                            if(array1[1]!=null){
                                ctx.fillText(array1[0], 136-array1_1_width.width-(128-array1_1_width.width)/2 , 138);
                                ctx.fillText(array1[1], 136-array1_2_width.width-(128-array1_2_width.width)/2, 162);
                            }
                            else{
                                ctx.fillText(array1[0], 136-array1_1_width.width-(128-array1_1_width.width)/2 , 150);
                            }
                        }
                        else{
                            ctx.fillText(home_team_name, 136-home_team_name_width.width-(128-home_team_name_width.width)/2 , 150);
                        }
                        ctx.font="28px BetLiveMedium";
                        if(away_team_name_width.width>128){
                            var array2 = away_team_name.split(" ");
                            let array2_1_width=ctx.measureText(array2[0]);
                            let array2_2_width=ctx.measureText(array2[1]);
                            let font_size2=28;
                            while(ctx.measureText(array2[0]).width>128 || ctx.measureText(array2[1]).width>128){
                                font_size2--;
                                ctx.font=font_size2+"px BetLiveMedium";
                                array2_1_width=ctx.measureText(array2[0]);
                                array2_2_width=ctx.measureText(array2[1]);
                            }
                            if(array2[1]!=null){
                                ctx.fillText(array2[0], 270-array2_1_width.width-(128-array2_1_width.width)/2 , 138);
                                ctx.fillText(array2[1], 270-array2_2_width.width-((128-array2_2_width.width)/2), 162);
                            }
                            else{
                                ctx.fillText(array2[0], 270-array2_1_width.width-(128-array2_1_width.width)/2 , 150);
                            }
                        }
                        else{
                            ctx.fillText(away_team_name, 270-away_team_name_width.width-(128-away_team_name_width.width)/2 , 150);
                        }
                        var home_team_logo =new Image();
                        var away_team_logo =new Image();
                        home_team_logo.src = 'storage/teams/'+match.home_team.logo;
                        away_team_logo.src = 'storage/teams/'+match.away_team.logo;
                        home_team_logo.onload = function(){
                            let home_logo_scale = home_team_logo.height/130;
                            let home_logo_width = home_team_logo.width/home_logo_scale;
                            ctx.drawImage(home_team_logo, 136-home_logo_width-(128-home_logo_width)/2, 180, home_logo_width, 130);
                        }
                        away_team_logo.onload = function(){
                            let away_logo_scale = away_team_logo.height/130;
                            let away_logo_width = away_team_logo.width/away_logo_scale;
                            ctx.drawImage(away_team_logo, 270-away_logo_width-(128-away_logo_width)/2, 180, away_logo_width, 130);
                        }
                    }
                }
                return true;
            },
            create_canvas_for_download(){
                            //canvas to download
                this.canvas2=this.$refs.canvas2;
                this.context2=this.canvas2.getContext('2d');
                var ctx2=this.context2;
                let scale_properly=this.canvas2.width/this.canvas.width;
                ctx2.font = 28*scale_properly+"px BetLiveMedium";
                ctx2.fillStyle="white";
                var background_image2 = new Image();
                let canvas_width2=this.canvas2.width;
                let canvas_height2=this.canvas2.height;
                if(this.selected_matches!=null){
                    var match2=this.selected_matches[0];
                }
                background_image2.src = 'storage/backgrounds/'+this.current_background.url;
                background_image2.onload = function(){
                    let scale2 = Math.max(canvas_width2 / this.width, canvas_height2 / this.height);
                    let x2 = (canvas_width2 / 2) - (this.width / 2) * scale2;
                    let y2 = (canvas_height2 / 2) - (this.height / 2) * scale2;
                    ctx2.drawImage(background_image2, x2*scale_properly, y2*scale_properly, this.width * scale2, this.height * scale2);
                    if(match2!=null){
                        let home_team_name2= match2.home_team.name.toUpperCase();
                        let away_team_name2= match2.away_team.name.toUpperCase();
                        let home_team_name_width2=ctx2.measureText(home_team_name2);
                        let away_team_name_width2=ctx2.measureText(away_team_name2);
                        if(home_team_name_width2.width>128*scale_properly){
                            var array12 = home_team_name2.split(" ");
                            let array1_1_width2=ctx2.measureText(array12[0]);
                            let array1_2_width2=ctx2.measureText(array12[1]);
                            let font_size2=28*scale_properly;
                            while(ctx2.measureText(array1[0]).width>128*scale_properly || ctx.measureText(array1[1]).width>128*scale_properly){
                                font_size2--;
                                ctx2.font=font_size2+"px BetLiveMedium";
                                array1_1_width2=ctx2.measureText(array12[0]);
                                array1_2_width2=ctx2.measureText(array12[1]);
                            }
                            if(array12[1]!=null){
                                ctx2.fillText(array12[0], scale_properly*136-array1_1_width2.width-(scale_properly*128-array1_1_width2.width)/2 , scale_properly*138);
                                ctx2.fillText(array12[1], scale_properly*136-array1_2_width2.width-(scale_properly*128-array1_2_width2.width)/2, scale_properly*162);
                            }
                            else{
                                ctx2.fillText(array12[0], scale_properly*136-array1_1_width2.width-(scale_properly*128-array1_1_width2.width)/2 , scale_properly*150);
                            }
                        }
                        else{
                            ctx2.fillText(home_team_name2, scale_properly*136-home_team_name_width2.width-(scale_properly*128-home_team_name_width2.width)/2 , scale_properly*150);
                        }
                        ctx.font=scale_properly*28+"px BetLiveMedium";
                        if(away_team_name_width2.width>scale_properly*128){
                            var array22 = away_team_name2.split(" ");
                            let array2_1_width2=ctx2.measureText(array22[0]);
                            let array2_2_width2=ctx2.measureText(array22[1]);
                            let font_size22=scale_properly*28;
                            while(ctx2.measureText(array22[0]).width>scale_properly*128 || ctx2.measureText(array22[1]).width>scale_properly*128){
                                font_size2--;
                                ctx2.font=font_size22+"px BetLiveMedium";
                                array2_1_width2=ctx2.measureText(array22[0]);
                                array2_2_width2=ctx2.measureText(array22[1]);
                            }
                            if(array22[1]!=null){
                                ctx2.fillText(array22[0], scale_properly*270-array2_1_width2.width-(scale_properly*128-array2_1_width2.width)/2 , scale_properly*138);
                                ctx2.fillText(array22[1], scale_properly*270-array2_2_width2.width-((scale_properly*128-array2_2_width2.width)/2), scale_properly*162);
                            }
                            else{
                                ctx2.fillText(array22[0], scale_properly*270-array2_1_width22.width-(scale_properly*128-array2_1_width2.width)/2 , scale_properly*150);
                            }
                        }
                        else{
                            ctx2.fillText(away_team_name2, scale_properly*270-away_team_name_width2.width-(scale_properly*128-away_team_name_width2.width)/2 , scale_properly*150);
                        }
                        var home_team_logo2 =new Image();
                        var away_team_logo2 =new Image();
                        home_team_logo2.src = 'storage/teams/'+match.home_team.logo;
                        away_team_logo2.src = 'storage/teams/'+match.away_team.logo;
                        home_team_logo2.onload = function(){
                            let home_logo_scale2 = home_team_logo2.height/(scale_properly*130);
                            let home_logo_width2 = home_team_logo2.width/home_logo_scale2;
                            ctx2.drawImage(home_team_logo2, scale_properly*136-home_logo_width2-(scale_properly*128-home_logo_width2)/2, scale_properly*180, home_logo_width2, scale_properly*130);
                        }
                        away_team_logo2.onload = function(){
                            let away_logo_scale2 = away_team_logo2.height/(scale_properly*130);
                            let away_logo_width2 = away_team_logo2.width/away_logo_scale2;
                            ctx2.drawImage(away_team_logo2, scale_properly*270-away_logo_width2-(scale_properly*128-away_logo_width2)/2, scale_properly*180, away_logo_width2, scale_properly*130);
                        }
                    }
                }
                return true;
            }
},

mounted(){
    this.create_displayed_canvas()
    this.create_canvas_for_download();
},

created(){
    this.get_template_options()
    .then((response) => {
      if(this.resolution==null){
        this.resolution_form.width=1080;
        this.resolution_form.height=1920;
        this.resolution_form.aspect_id=this.current_template.aspect_id;
        this.resolution_form.id=1;
        this.$store.dispatch('templateOptions/changeResolution', this.resolution_form);
    }
    else{
        this.resolution_form=this.resolution;
    }
    })
    if(this.current_background==null){
        this.my_backgrounds.forEach(background => {
            if(background.id==this.current_template.background_id){
                background.url=this.current_template.id;
                return this.$store.dispatch('backgrounds/currentBackground', background);
            }
        });
        this.other_backgrounds.forEach(background => {
            if(background.id==this.current_template.background_id){
                background.url=this.current_template.id;
                return this.$store.dispatch('backgrounds/currentBackground', background);
            }
        });
    }
},
};
</script>
