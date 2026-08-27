import {ICONS, IMAGES} from '../src/assets';

describe('Centralized Assets Registry', () => {
  test('ICONS contains torch assets', () => {
    expect(ICONS.torchOn).toBeDefined();
    expect(ICONS.torchOff).toBeDefined();
    expect(ICONS.touchOn).toBeDefined();
    expect(ICONS.touchOff).toBeDefined();
  });

  test('IMAGES contains theme wallpapers', () => {
    expect(IMAGES.theme.theme1).toBeDefined();
    expect(IMAGES.theme.theme2).toBeDefined();
    expect(IMAGES.wallpapers.midnightBloom).toBeDefined();
    expect(IMAGES.wallpapers.sunsetWave).toBeDefined();
    expect(IMAGES.wallpapers.auroraCyan).toBeDefined();
  });
});
