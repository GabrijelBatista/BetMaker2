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
                    >Opcije</v-btn>
                    </template>
                    <v-card id="dialog_box">
                        <v-card-title class="headline grey lighten-2">
                            Opcije
                        </v-card-title>
                        <v-form @submit.prevent="change_resolution" ref="form">
                            <v-col class="d-flex" cols="12" sm="6">
                                <v-radio-group v-model="resolution_form">
                                    <v-radio
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
    <canvas ref="canvas" id="div_to_capture"
    width="278.4375px"
    height="495px"
    >
    </canvas>
    <canvas ref="canvas2" id="div_to_capture2"
    width="278.4375px"
    height="495px"
    >
    </canvas>
</v-card>
</template>

<script>
import {
    mdiCamera,
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
            mdiCamera
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

            //canvas to download
            this.canvas2=this.$refs.canvas2;
            this.canvas2.width=this.resolution.width;
            this.canvas2.height=this.resolution.height;
            this.context2=this.canvas2.getContext('2d');
            var ctx2=this.context2;
            ctx2.drawImage(this.$refs.canvas, 0, 0, this.canvas2.width, this.canvas2.height);

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
            return this.$store.dispatch('templateOptions/getTemplateResolutions', this.current_template.aspect_id);
        },
},

mounted(){
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
}
};
</script>
