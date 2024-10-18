import CustomEventHandler from "../CustomEventHandler";

const GLOBAL = {
  num: 0,
};

describe('Test Custom Event Handler', () => {
  it('Listeners Test', () => {
    const handler = new CustomEventHandler<number>();
    handler.add('l1', (val: number) => {});
    handler.add('l2', (val: number) => {});
    expect(handler.listenerCount).toBe(2);

    handler.remove('l2');
    expect(handler.listenerCount).toBe(1);
  });

  it('Invocation Test', () => {
    const handler = new CustomEventHandler<number>();
    handler.add('l1', (val: number) => {
      console.log('Global.num', val);
      GLOBAL.num = val;
    });
    handler.invokeSync(5);
    expect(GLOBAL.num).toEqual(5);
  });
});