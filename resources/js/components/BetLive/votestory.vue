<template>
    <v-card fluid class="fill-height" id="main_content">
        <v-overlay v-show="this.loading">
            <div class="flower-spinner">
                <div class="dots-container">
                    <div class="bigger-dot">
                        <div class="smaller-dot"></div>
                    </div>
                </div>
            </div>
        </v-overlay>
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
                            class="mr-4"
                            type="submit"
                            @click="dialog = false"
                        >
                            POTVRDI
                        </v-btn>
                        <v-btn
                            class="mr-4"
                            @click="dialog = false"
                        >
                            ODUSTANI
                        </v-btn>
                    </v-card-actions>
                </v-form>
            </v-card>
        </v-dialog>
        <v-btn id="screenshot" @click="download_image()"><v-icon>{{icons.mdiCamera}}</v-icon></v-btn>
        <v-dialog
            transition="dialog-top-transition"
            max-width="600"
            overlay-opacity="0.8"
            v-model="dialog2"
        >
            <template v-slot:activator="{ on, attrs }">
                <v-btn
                    v-bind="attrs"
                    v-on="on"
                    id="info_tab"
                    style="font-family: BetLiveMedium; float:right"
                >{{current_template.name}}</v-btn>
            </template>
            <v-card id="dialog_box2">
                <v-card-title class="card_title justify-center">
                    {{current_template.name}}
                </v-card-title>
                    <v-card-text dark class="d-flex justify-center card_text" cols="12" sm="6">
                        Naziv: {{current_template.name}}
                    </v-card-text>
                    <v-card-text  dark class="d-flex justify-center card_text" cols="12" sm="6">
                        Maksimalan broj mečeva: {{current_template.max_matches}}
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn
                            class="mr-4"
                            @click="dialog2 = false"
                        >
                            ZATVORI
                        </v-btn>
                    </v-card-actions>
            </v-card>
        </v-dialog>
        <canvas ref="canvas" class="div_to_capture" id="div_to_capture916"
                width="278.4375px"
                height="495px"
        >
        </canvas>
        <canvas ref="canvas2" id="div_to_capture2"
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
        loading: false,
        resolution_form: {
            id: null,
            width: null,
            height: null,
            aspect_id: null
        },
        dialog: false,
        dialog2: false,
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

            let img = document.createElement('a');
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
            this.$store.dispatch('templateOptions/changeResolution', this.resolution_form)
                .then(()=> {
                    this.canvas_to_download(this.resolution);
                });
        },

        get_template_options(){
          return  this.$store.dispatch('templateOptions/getTemplateResolutions', this.current_template.aspect_id);
        },

        canvas_to_display() {
            this.loading=true;
            const this_this=this
            document.fonts.ready.then(function () {
                //canvas to show
                this_this.canvas = this_this.$refs.canvas;
                this_this.context = this_this.canvas.getContext('2d');
                let ctx = this_this.context;
                ctx.font = "28px BetLiveMedium";
                ctx.fillStyle = "white";
                let background_image = new Image();
                let canvas_width = this_this.canvas.width;
                let canvas_height = this_this.canvas.height;
                if (this_this.selected_matches != null) {
                    var match = this_this.selected_matches[0];
                }
                background_image.src = 'storage/backgrounds/' + this_this.current_background.url;
                background_image.onload = function () {
                    let scale = Math.max(canvas_width / this.width, canvas_height / this.height);
                    let x = (canvas_width / 2) - (this.width / 2) * scale;
                    let y = (canvas_height / 2) - (this.height / 2) * scale;
                    ctx.drawImage(background_image, x, y, this.width * scale, this.height * scale);
                    if (match != null) {
                        let home_team_name = match.home_team.name.toUpperCase();
                        let away_team_name = match.away_team.name.toUpperCase();
                        let home_team_name_width = ctx.measureText(home_team_name);
                        let away_team_name_width = ctx.measureText(away_team_name);
                        if (home_team_name_width.width > 128) {
                            let array1 = home_team_name.split(" ");
                            if (array1[2]) {
                                var array_rest = array1[1] + " " + array1[2];
                            } else {
                                var array_rest = array1[1];
                            }
                            let array1_1_width = ctx.measureText(array1[0]);
                            let array1_2_width = ctx.measureText(array_rest);
                            let font_size = 28;
                            while (ctx.measureText(array1[0]).width > 128 || ctx.measureText(array_rest).width > 128) {
                                font_size--;
                                ctx.font = font_size + "px BetLiveMedium";
                                array1_1_width = ctx.measureText(array1[0]);
                                array1_2_width = ctx.measureText(array_rest);
                            }
                            if (array_rest != null) {
                                ctx.fillText(array1[0], 136 - array1_1_width.width - (128 - array1_1_width.width) / 2, 138);
                                ctx.fillText(array_rest, 136 - array1_2_width.width - (128 - array1_2_width.width) / 2, 162);
                            } else {
                                ctx.fillText(array1[0], 136 - array1_1_width.width - (128 - array1_1_width.width) / 2, 150);
                            }
                        } else {
                            ctx.fillText(home_team_name, 136 - home_team_name_width.width - (128 - home_team_name_width.width) / 2, 150);
                        }
                        ctx.font = "28px BetLiveMedium";
                        if (away_team_name_width.width > 128) {
                            let array2 = away_team_name.split(" ");
                            let array2_1_width = ctx.measureText(array2[0]);
                            if (array2[2]) {
                                var array_rest2 = array2[1] + " " + array2[2];
                            } else {
                                var array_rest2 = array2[1];
                            }
                            let array2_2_width = ctx.measureText(array_rest2);
                            let font_size2 = 28;
                            while (ctx.measureText(array2[0]).width > 128 || ctx.measureText(array_rest2).width > 128) {
                                font_size2--;
                                ctx.font = font_size2 + "px BetLiveMedium";
                                array2_1_width = ctx.measureText(array2[0]);
                                array2_2_width = ctx.measureText(array_rest2);
                            }
                            if (array_rest2 != null) {
                                ctx.fillText(array2[0], 270 - array2_1_width.width - (128 - array2_1_width.width) / 2, 138);
                                ctx.fillText(array_rest2, 270 - array2_2_width.width - ((128 - array2_2_width.width) / 2), 162);
                            } else {
                                ctx.fillText(array2[0], 270 - array2_1_width.width - (128 - array2_1_width.width) / 2, 150);
                            }
                        } else {
                            ctx.fillText(away_team_name, 270 - away_team_name_width.width - (128 - away_team_name_width.width) / 2, 150);
                        }
                        let home_team_logo = new Image();
                        let away_team_logo = new Image();
                        home_team_logo.src = 'storage/teams/' + match.home_team.logo;
                        away_team_logo.src = 'storage/teams/' + match.away_team.logo;
                        home_team_logo.onload = function () {
                            let home_logo_scale = home_team_logo.height / 130;
                            let home_logo_width = home_team_logo.width / home_logo_scale;
                            ctx.drawImage(home_team_logo, 136 - home_logo_width - (128 - home_logo_width) / 2, 180, home_logo_width, 130);
                        }
                        away_team_logo.onload = function () {
                            let away_logo_scale = away_team_logo.height / 130;
                            let away_logo_width = away_team_logo.width / away_logo_scale;
                            ctx.drawImage(away_team_logo, 270 - away_logo_width - (128 - away_logo_width) / 2, 180, away_logo_width, 130);
                        }
                    }
                }
            })
            this.loading=false;
        },

        canvas_to_download(res){
            //canvas to download
            const this_this=this
            document.fonts.ready.then(function () {
                this_this.canvas2 = this_this.$refs.canvas2;
                this_this.context2 = this_this.canvas2.getContext('2d');
                let ctx2 = this_this.context2;
                this_this.canvas2.width = res.width;
                this_this.canvas2.height = res.height;
                let scale_properly = this_this.canvas2.width / this_this.canvas.width;
                ctx2.font = 28 * scale_properly + "px BetLiveMedium";
                ctx2.fillStyle = "white";
                let background_image2 = new Image();
                let canvas_width2 = this_this.canvas2.width;
                let canvas_height2 = this_this.canvas2.height;
                if (this_this.selected_matches != null) {
                    var match2 = this_this.selected_matches[0];
                }
                background_image2.src = 'storage/backgrounds/' + this_this.current_background.url;
                background_image2.onload = function () {
                    let scale2 = Math.max(canvas_width2 / this.width, canvas_height2 / this.height);
                    let x2 = (canvas_width2 / 2) - (this.width / 2) * scale2;
                    let y2 = (canvas_height2 / 2) - (this.height / 2) * scale2;
                    ctx2.drawImage(background_image2, x2, y2, this.width * scale2, this.height * scale2);
                    if (match2 != null) {
                        let home_team_name2 = match2.home_team.name.toUpperCase();
                        let away_team_name2 = match2.away_team.name.toUpperCase();
                        let home_team_name_width2 = ctx2.measureText(home_team_name2);
                        let away_team_name_width2 = ctx2.measureText(away_team_name2);
                        if (home_team_name_width2.width > 128 * scale_properly) {
                            let array12 = home_team_name2.split(" ");
                            let array1_1_width2 = ctx2.measureText(array12[0]);
                            if (array12[2]) {
                                var array_rest12 = array12[1] + " " + array12[2];
                            } else {
                                var array_rest12 = array12[1];
                            }
                            let array1_2_width2 = ctx2.measureText(array_rest12);
                            let font_size2 = 28 * scale_properly;
                            while (ctx2.measureText(array12[0]).width > 128 * scale_properly || ctx2.measureText(array_rest12).width > 128 * scale_properly) {
                                font_size2--;
                                ctx2.font = font_size2 + "px BetLiveMedium";
                                array1_1_width2 = ctx2.measureText(array12[0]);
                                array1_2_width2 = ctx2.measureText(array_rest12);
                            }
                            if (array_rest12 != null) {
                                ctx2.fillText(array12[0], scale_properly * 136 - array1_1_width2.width - (scale_properly * 128 - array1_1_width2.width) / 2, scale_properly * 138);
                                ctx2.fillText(array_rest12, scale_properly * 136 - array1_2_width2.width - (scale_properly * 128 - array1_2_width2.width) / 2, scale_properly * 162);
                            } else {
                                ctx2.fillText(array12[0], scale_properly * 136 - array1_1_width2.width - (scale_properly * 128 - array1_1_width2.width) / 2, scale_properly * 150);
                            }
                        } else {
                            ctx2.fillText(home_team_name2, scale_properly * 136 - home_team_name_width2.width - (scale_properly * 128 - home_team_name_width2.width) / 2, scale_properly * 150);
                        }
                        ctx2.font = scale_properly * 28 + "px BetLiveMedium";
                        if (away_team_name_width2.width > scale_properly * 128) {
                            let array22 = away_team_name2.split(" ");
                            let array2_1_width2 = ctx2.measureText(array22[0]);
                            if (array22[2]) {
                                var array_rest22 = array22[1] + " " + array22[2];
                            } else {
                                var array_rest22 = array22[1];
                            }
                            let array2_2_width2 = ctx2.measureText(array_rest22);
                            let font_size22 = scale_properly * 28;
                            while (ctx2.measureText(array22[0]).width > scale_properly * 128 || ctx2.measureText(array_rest22).width > scale_properly * 128) {
                                font_size22--;
                                ctx2.font = font_size22 + "px BetLiveMedium";
                                array2_1_width2 = ctx2.measureText(array22[0]);
                                array2_2_width2 = ctx2.measureText(array_rest22);
                            }
                            if (array_rest22 != null) {
                                ctx2.fillText(array22[0], scale_properly * 270 - array2_1_width2.width - (scale_properly * 128 - array2_1_width2.width) / 2, scale_properly * 138);
                                ctx2.fillText(array_rest22, scale_properly * 270 - array2_2_width2.width - ((scale_properly * 128 - array2_2_width2.width) / 2), scale_properly * 162);
                            } else {
                                ctx2.fillText(array22[0], scale_properly * 270 - array2_1_width2.width - (scale_properly * 128 - array2_1_width2.width) / 2, scale_properly * 150);
                            }
                        } else {
                            ctx2.fillText(away_team_name2, scale_properly * 270 - away_team_name_width2.width - (scale_properly * 128 - away_team_name_width2.width) / 2, scale_properly * 150);
                        }
                        let home_team_logo2 = new Image();
                        let away_team_logo2 = new Image();
                        home_team_logo2.src = 'storage/teams/' + match2.home_team.logo;
                        away_team_logo2.src = 'storage/teams/' + match2.away_team.logo;
                        home_team_logo2.onload = function () {
                            let home_logo_scale2 = home_team_logo2.height / (scale_properly * 130);
                            let home_logo_width2 = home_team_logo2.width / home_logo_scale2;
                            ctx2.drawImage(home_team_logo2, scale_properly * 136 - home_logo_width2 - (scale_properly * 128 - home_logo_width2) / 2, scale_properly * 180, home_logo_width2, scale_properly * 130);
                        }
                        away_team_logo2.onload = function () {
                            let away_logo_scale2 = away_team_logo2.height / (scale_properly * 130);
                            let away_logo_width2 = away_team_logo2.width / away_logo_scale2;
                            ctx2.drawImage(away_team_logo2, scale_properly * 270 - away_logo_width2 - (scale_properly * 128 - away_logo_width2) / 2, scale_properly * 180, away_logo_width2, scale_properly * 130);
                        }
                    }
                }
            })
        }
    },

    mounted(){
        this.canvas_to_display();
        if(this.resolution!=null) {
            this.canvas_to_download(this.resolution);
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
<style scoped>
.flower-spinner,  .flower-spinner * {
    box-sizing: border-box;
}

.flower-spinner {
    height: 70px;
    width: 70px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
}

.flower-spinner .dots-container {
    height: calc(70px / 7);
    width: calc(70px / 7);
}

.flower-spinner .smaller-dot {
    background: #ff1d5e;
    height: 100%;
    width: 100%;
    border-radius: 50%;
    animation: flower-spinner-smaller-dot-animation 2.5s 0s infinite both;

}

.flower-spinner .bigger-dot {
    background: #ff1d5e;
    height: 100%;
    width: 100%;
    padding: 10%;
    border-radius: 50%;
    animation: flower-spinner-bigger-dot-animation 2.5s 0s infinite both;
}

@keyframes flower-spinner-bigger-dot-animation {
    0%, 100% {
        box-shadow: rgb(255, 29, 94) 0px 0px 0px,
        rgb(255, 29, 94) 0px 0px 0px,
        rgb(255, 29, 94) 0px 0px 0px,
        rgb(255, 29, 94) 0px 0px 0px,
        rgb(255, 29, 94) 0px 0px 0px,
        rgb(255, 29, 94) 0px 0px 0px,
        rgb(255, 29, 94) 0px 0px 0px,
        rgb(255, 29, 94) 0px 0px 0px;
    }

    50% {
        transform: rotate(180deg);
    }

    25%, 75% {
        box-shadow: rgb(255, 29, 94) 26px 0px 0px,
        rgb(255, 29, 94) -26px 0px 0px,
        rgb(255, 29, 94) 0px 26px 0px,
        rgb(255, 29, 94) 0px -26px 0px,
        rgb(255, 29, 94) 19px -19px 0px,
        rgb(255, 29, 94) 19px 19px 0px,
        rgb(255, 29, 94) -19px -19px 0px,
        rgb(255, 29, 94) -19px 19px 0px;
    }

    100% {
        transform: rotate(360deg);
        box-shadow: rgb(255, 29, 94) 0px 0px 0px,
        rgb(255, 29, 94) 0px 0px 0px,
        rgb(255, 29, 94) 0px 0px 0px,
        rgb(255, 29, 94) 0px 0px 0px,
        rgb(255, 29, 94) 0px 0px 0px,
        rgb(255, 29, 94) 0px 0px 0px,
        rgb(255, 29, 94) 0px 0px 0px,
        rgb(255, 29, 94) 0px 0px 0px;
    }
}

@keyframes flower-spinner-smaller-dot-animation {
    0%, 100% {
        box-shadow: rgb(255, 29, 94) 0px 0px 0px,
        rgb(255, 29, 94) 0px 0px 0px,
        rgb(255, 29, 94) 0px 0px 0px,
        rgb(255, 29, 94) 0px 0px 0px,
        rgb(255, 29, 94) 0px 0px 0px,
        rgb(255, 29, 94) 0px 0px 0px,
        rgb(255, 29, 94) 0px 0px 0px,
        rgb(255, 29, 94) 0px 0px 0px;
    }

    25%, 75% {
        box-shadow: rgb(255, 29, 94) 14px 0px 0px,
        rgb(255, 29, 94) -14px 0px 0px,
        rgb(255, 29, 94) 0px 14px 0px,
        rgb(255, 29, 94) 0px -14px 0px,
        rgb(255, 29, 94) 10px -10px 0px,
        rgb(255, 29, 94) 10px 10px 0px,
        rgb(255, 29, 94) -10px -10px 0px,
        rgb(255, 29, 94) -10px 10px 0px;
    }

    100% {
        box-shadow: rgb(255, 29, 94) 0px 0px 0px,
        rgb(255, 29, 94) 0px 0px 0px,
        rgb(255, 29, 94) 0px 0px 0px,
        rgb(255, 29, 94) 0px 0px 0px,
        rgb(255, 29, 94) 0px 0px 0px,
        rgb(255, 29, 94) 0px 0px 0px,
        rgb(255, 29, 94) 0px 0px 0px,
        rgb(255, 29, 94) 0px 0px 0px;
    }
}
</style>
