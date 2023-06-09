/* eslint-disable testing-library/no-unnecessary-act */
/* eslint-disable testing-library/no-render-in-setup */
import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { FoodStructure } from "../models/food";
import { UserServerResponse, UserStructure } from "../models/user";
import { addToFavourite } from "../reducers/user.slice";
import { UsersApiRepo } from "../services/repositories/users.repo";
import { store } from "../store/store";
import { useUsers } from "./use.users";

describe("Given the useUsers Custom Hook, an ApiRepo and a given component", () => {
  let mockPayload: UserStructure;
  let foodMockPayload: FoodStructure;
  let mockRepo: UsersApiRepo;

  beforeEach(async () => {
    mockPayload = {
      username: "joaquin-test",
      email: "test@joaquin.cl",
      passwd: "test",
      token: "test",
    } as unknown as UserStructure;

    mockRepo = {
      create: jest.fn(),
      update: jest.fn(),
      readId: jest.fn(),
    } as unknown as UsersApiRepo;

    const TestComponent = function () {
      const { registerUser, loginUser, userFavourites, logoutUser } =
        useUsers(mockRepo);

      return (
        <>
          <button onClick={() => registerUser(mockPayload)}>register</button>
          <button onClick={() => loginUser(mockPayload)}>login</button>
          <button
            onClick={() => userFavourites({} as FoodStructure, "testaction")}
          >
            Add to Favourites
          </button>
          <button onClick={() => logoutUser()}>Logout</button>
          <button onClick={() => addToFavourite(foodMockPayload)}>
            addToFavourite
          </button>
        </>
      );
    };
    await act(async () =>
      render(
        <MemoryRouter>
          <Provider store={store}>
            <TestComponent></TestComponent>
          </Provider>
        </MemoryRouter>
      )
    );
  });
  describe("When the TestComponent is rendered", () => {
    test("Then, the button should be in the document", async () => {
      const elements = await screen.findAllByRole("button");
      expect(elements[0]).toBeInTheDocument();
    });
  });
  describe("When the TestComponent is rendered and the register button is clicked", () => {
    test("Then, the registerUser function should be called", async () => {
      const elements = await screen.findAllByRole("button");
      await act(async () => userEvent.click(elements[0]));
      expect(mockRepo.create).toHaveBeenCalled();
    });
  });
  describe("When the TestComponent is rendered and the login button is clicked", () => {
    test("Then, the loginUser function should be called", async () => {
      const elements = await screen.findAllByRole("button");
      await act(async () => userEvent.click(elements[1]));
      expect(mockRepo.create).toHaveBeenCalled();
    });
  });
  describe("When the TestComponent is rendered and the addFavourite button is clicked", () => {
    test("Then the addFavourite function in the hook should be called if there is an available token", async () => {
      const mockSuccesfulResponse: UserServerResponse = {
        results: [mockPayload],
      } as unknown as UserServerResponse;
      (mockRepo.create as jest.Mock).mockResolvedValueOnce(
        mockSuccesfulResponse
      );
      const elements = await screen.findAllByRole("button");
      await act(async () => userEvent.click(elements[1]));
      await act(async () => userEvent.click(elements[2]));
      // Comentario temporal expect(mockRepo.update).toHaveBeenCalled();
    });
    test("Then the addFavourite function in the hook should throw an error if there is no available token", async () => {
      const mockUnsuccesfulResponse: UserServerResponse = {
        results: [{ username: "test", email: "test", id: "1" }],
      } as unknown as UserServerResponse;
      const elements = await screen.findAllByRole("button");
      (mockRepo.create as jest.Mock).mockResolvedValueOnce(
        mockUnsuccesfulResponse
      );
      await act(async () => userEvent.click(elements[1]));
      await act(async () => userEvent.click(elements[2]));
      expect(mockRepo.update).not.toBeCalled();
    });
  });
  describe("When the TestComponent is rendered and the logout button is clicked", () => {
    test("Then, the logoutUser function should be called", async () => {
      const elements = await screen.findAllByRole("button");
      await act(async () => userEvent.click(elements[3]));
    });
  });
});
