import Image from '../model/Images';

export default {
    render(image: Image) {
        return {
            id: image.id,
            url: `http://192.168.1.10:3333/uploads/${image.path}`,
        };
    },
    renderMany(iamges: Image[]) {
        return iamges.map( image => this.render(image));
    }
};