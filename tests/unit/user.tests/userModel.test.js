const mongoose = require("mongoose");

const {UserModel} = require("../../../models/user.model");
const { required } = require("joi");

jest.mock('mongoose', ()=>({
    Schema: jest.fn(),
    model: jest.fn().mockReturnValue(jest.fn())
}));

describe('User Model Test', ()=>{

    const mockSchema = {
        name: { type: String, required: true},
        email:{ type: String, required: true, unique:true, validate: function(v){
            return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(v);
        },
        message: props => `${props.value} is not a valid email address!`},
        password: { type: String, required: true},
        role: {type:String, enum: ["participant", "event-manager"], default: "participant"}
    };

    mongoose.Schema.mockImplementation(()=>({ ...mockSchema }));

    const mockValidateSync = jest.fn();
    const UserMock = jest.fn().mockImplementation(()=>({
        validateSync : mockValidateSync
    }));

    mongoose.model.mockReturnValue(UserMock);

    beforeEach(()=>{
        mockValidateSync.mockReset();
    });

    it('should create user schema with correct fields', () => {
        expect(mongoose.Schema).toHaveBeenCalledWith({
          name: { type: String, required: true },
          email: { type: String, required: true, unique: true, validate: expect.any(Object) },
    
            password: {type:String, required: true},
            role: {type:String, enum: ["participant", "event-manager"], default: "participant"}
        })
    })

    it('should validate required fields', () => {
        mockValidateSync.mockReturnValue({
          errors: {
            name: new Error('Name is required'),
            email: new Error('Email is required'),
            password: new Error('Password is required')
          }
        });
        const user = new UserMock({});
        const validationError = user.validateSync();
        expect(validationError.errors.name).toBeDefined();
        expect(validationError.errors.email).toBeDefined();
        expect(validationError.errors.password).toBeDefined();
      });
    
      it('should validate email format', () => {
        mockValidateSync.mockReturnValue({
          errors: {
            email: new Error('Invalid email format')
          }
        });
        const user = new UserMock({
          name: 'John Doe',
          email: 'invalid-email',
          password: 12345678
        });
        const validationError = user.validateSync();
        expect(validationError.errors.email).toBeDefined();
      });
    
      it('should accept valid user data', () => {
        mockValidateSync.mockReturnValue(undefined);
        const user = new UserMock({
          name: 'John Doe',
          email: 'john@example.com',
          password: 12345678
        });
        const validationError = user.validateSync();
        expect(validationError).toBeUndefined();
      });
    });


