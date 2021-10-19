import { MessageService } from "./message.service"

//Test a service with no dependencies

describe('MessageService', ()=>{
    let service: MessageService; 

    //Se puede hacer dentron del beforeEach si lo que se requiere hacer el set de las pruebas es muy complejo
    // beforeEach(()=>{
    //     service = new MessageService();
    // })

    it('Should have no messages to start', ()=>{
        service = new MessageService();
        expect(service.messages.length).toBe(0);
    })

    it('Should add a message when add is called', ()=>{
        service = new MessageService();
        service.add('Message1');
        expect(service.messages.length).toBe(1);
    })

    it('Should remove all messages when clear is called', ()=>{
        service = new MessageService();
        service.add('Message1');
        
        service.clear();

        expect(service.messages.length).toBe(0);
    })
})